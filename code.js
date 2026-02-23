"use strict";
// ProofX — Content Protection Plugin for Figma
// Plugin backend: runs in the Figma sandbox (no DOM access)
const PLUGIN_DATA_KEY = "proofx_protection";
figma.showUI(__html__, {
    width: 360,
    height: 520,
    themeColors: true,
    title: "ProofX — Content Protection",
});
// ---------- Helpers ----------
function getSelectedNode() {
    const sel = figma.currentPage.selection;
    if (sel.length === 0)
        return null;
    return sel[0];
}
function sendSelectionInfo() {
    const node = getSelectedNode();
    if (!node) {
        figma.ui.postMessage({ type: "selection", node: null });
        return;
    }
    // Read stored protection data if any
    const raw = node.getPluginData(PLUGIN_DATA_KEY);
    let protection = null;
    if (raw) {
        try {
            protection = JSON.parse(raw);
        }
        catch (_a) {
            protection = null;
        }
    }
    figma.ui.postMessage({
        type: "selection",
        node: {
            id: node.id,
            name: node.name,
            width: Math.round(("width" in node ? node.width : 0)),
            height: Math.round(("height" in node ? node.height : 0)),
            type: node.type,
            protection,
        },
    });
}
async function exportNode(nodeId) {
    const node = figma.getNodeById(nodeId);
    if (!node) {
        figma.ui.postMessage({ type: "export-error", error: "Node not found." });
        return;
    }
    if (!("exportAsync" in node)) {
        figma.ui.postMessage({
            type: "export-error",
            error: "Selected element cannot be exported.",
        });
        return;
    }
    try {
        const bytes = await node.exportAsync({
            format: "PNG",
            constraint: { type: "SCALE", value: 2 },
        });
        figma.ui.postMessage({
            type: "export-result",
            bytes: Array.from(bytes),
            nodeId: node.id,
            nodeName: node.name,
        });
    }
    catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        figma.ui.postMessage({ type: "export-error", error: msg });
    }
}
function storeProtection(nodeId, data) {
    const node = figma.getNodeById(nodeId);
    if (!node)
        return;
    node.setPluginData(PLUGIN_DATA_KEY, JSON.stringify(data));
}
// ---------- Selection listener ----------
figma.on("selectionchange", () => {
    sendSelectionInfo();
});
// ---------- Message handler ----------
figma.ui.onmessage = async (msg) => {
    switch (msg.type) {
        case "get-selection":
            sendSelectionInfo();
            break;
        case "protect": {
            const node = getSelectedNode();
            if (!node) {
                figma.notify("Select a frame or component first.", { error: true });
                return;
            }
            figma.notify("Exporting frame...");
            await exportNode(node.id);
            break;
        }
        case "store-protection": {
            const { nodeId, data } = msg;
            storeProtection(nodeId, data);
            figma.notify("Protection recorded on frame.", { timeout: 3000 });
            sendSelectionInfo();
            break;
        }
        case "save-creator-id": {
            const creatorId = msg.creatorId;
            await figma.clientStorage.setAsync("creator_id", creatorId);
            figma.notify("Creator ID saved.", { timeout: 2000 });
            break;
        }
        case "load-creator-id": {
            const stored = await figma.clientStorage.getAsync("creator_id");
            figma.ui.postMessage({
                type: "creator-id",
                creatorId: stored || "",
            });
            break;
        }
        case "notify": {
            const isError = msg.error === true;
            figma.notify(msg.message, {
                error: isError,
                timeout: msg.timeout || 3000,
            });
            break;
        }
        default:
            break;
    }
};
// Initial load
sendSelectionInfo();

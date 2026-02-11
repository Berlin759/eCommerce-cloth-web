import axios from "axios";
import mongoose from "mongoose";
import FormData from "form-data";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import orderModel from "../models/orderModel.js";

const { ObjectId } = mongoose.Types;

const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const OWNER_PHONE = process.env.OWNER_WHATSAPP_NUMBER;

export const sendOrderToOwner = async (order) => {
    try {
        const itemsText = order.items
            .map(
                (i, index) =>
                    `${index + 1}. ${i.name}\nQty: ${i.quantity}\nPrice: ₹${i.price}`
            )
            .join("\n\n");

        const message = `
🛒 *New Order Received*

📦 Order ID: ${order.orderId}
👤 Customer: ${order.customerName}
📞 Phone: ${order.phone}
📍 Address:
${order.street},
${order.city} - ${order.zipcode},
${order.state}, ${order.country}

💳 Payment: ${order.paymentMethod.toUpperCase()}
💰 Amount: ₹${order.totalAmount}

🧾 Items:
${itemsText}

Tap below to proceed 👇.
        `.trim();

        const res = await axios.post(
            `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,
            {
                messaging_product: "whatsapp",
                to: OWNER_PHONE,
                type: "interactive",
                interactive: {
                    type: "button",
                    body: { text: message },
                    action: {
                        buttons: [
                            {
                                type: "reply",
                                reply: {
                                    id: `SHIP_${order._id}`,
                                    title: "📦 Mark as Shipped",
                                },
                            },
                            {
                                type: "reply",
                                reply: {
                                    id: `CANCEL_${order._id}`,
                                    title: "❌ Cancel Order",
                                },
                            },
                        ],
                    },
                },
                // text: { body: message },
            },
            {
                headers: {
                    Authorization: `Bearer ${WHATSAPP_TOKEN}`,
                    "Content-Type": "application/json",
                },
            },
        );

        const { filePath, fileName } = await generateInvoicePDF(order);
        await sendInvoicePDF(filePath, fileName);

        return { success: true, message: "Order details send whatsApp successfully", data: res.data };
    } catch (error) {
        console.error("WhatsApp Order Send Error:", error.response?.data || error.message);
        return { success: false, message: error.response?.data || error.message };
    };
};

export const sendInvoicePDF = async (pdfPath, pdfName) => {
    const form = new FormData();
    form.append("file", fs.createReadStream(pdfPath));
    form.append("messaging_product", "whatsapp");

    const mediaRes = await axios.post(
        `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/media`,
        form,
        {
            headers: {
                Authorization: `Bearer ${WHATSAPP_TOKEN}`,
                ...form.getHeaders(),
            },
        }
    );

    await axios.post(
        `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,
        {
            messaging_product: "whatsapp",
            to: OWNER,
            type: "document",
            document: {
                id: mediaRes.data.id,
                filename: pdfName,
            },
        },
        { headers: { Authorization: `Bearer ${WHATSAPP_TOKEN}` } }
    );
};

export const generateInvoicePDF = async (order) => {
    return new Promise((resolve) => {
        const fileName = `invoice_${order.orderId}.pdf`;
        const filePath = path.join("uploads/invoices", fileName);

        const doc = new PDFDocument({ margin: 40 });
        doc.pipe(fs.createWriteStream(filePath));

        doc.fontSize(18).text("INVOICE", { align: "center" });
        doc.moveDown();

        doc.fontSize(12).text(`Order ID: ${order.orderId}`);
        doc.text(`Customer: ${order.customerName}`);
        doc.text(`Phone: ${order.phone}`);
        doc.text(`Payment: ${order.paymentMethod.toUpperCase()}`);
        doc.moveDown();

        doc.text("Items:");
        order.items.forEach((i, idx) => {
            doc.text(`${idx + 1}. ${i.name} - Qty: ${i.quantity} - ₹${i.price}`);
        });

        doc.moveDown();
        doc.fontSize(14).text(`Total Amount: ₹${order.totalAmount}`, {
            align: "right",
        });

        doc.end();
        resolve({ filePath, fileName });
    });
};

export const whatsappWebhook = async (req, res) => {
    const entry = req.body.entry?.[0];
    const change = entry?.changes?.[0]?.value;
    const message = change?.messages?.[0];

    if (message?.type === "interactive") {
        const actionId = message.interactive.button_reply.id;

        if (actionId.startsWith("SHIP_")) {
            const orderId = actionId.replace("SHIP_", "");

            await orderModel.findByIdAndUpdate(orderId, {
                status: "shipped",
            });

            // Optional admin shipment trigger here
        };
    };

    return res.sendStatus(200);
};
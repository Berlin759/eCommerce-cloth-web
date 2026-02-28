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

const isWhatsAppConfigured = () => {
    return WHATSAPP_TOKEN && WHATSAPP_TOKEN !== "" &&
        PHONE_NUMBER_ID && PHONE_NUMBER_ID !== "" &&
        OWNER_PHONE && OWNER_PHONE !== "";
};

export const sendOrderToOwner = async (order) => {
    try {
        if (!isWhatsAppConfigured()) {
            console.log("WhatsApp not configured. Skipping notification.");
            return { success: true, message: "WhatsApp not configured, notification skipped" };
        }

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

        // const res = await axios.post(
        //     `https://graph.facebook.com/v22.0/${PHONE_NUMBER_ID}/messages`,
        //     {
        //         messaging_product: "whatsapp",
        //         to: OWNER_PHONE,
        //         type: "interactive",
        //         interactive: {
        //             type: "button",
        //             body: { text: message },
        //             action: {
        //                 buttons: [
        //                     {
        //                         type: "reply",
        //                         reply: {
        //                             id: `SHIP_${order._id}`,
        //                             title: "📦 Mark as Shipped",
        //                         },
        //                     },
        //                     {
        //                         type: "reply",
        //                         reply: {
        //                             id: `CANCEL_${order._id}`,
        //                             title: "❌ Cancel Order",
        //                         },
        //                     },
        //                 ],
        //             },
        //         },
        //         // text: { body: message },
        //     },
        //     {
        //         headers: {
        //             Authorization: `Bearer ${WHATSAPP_TOKEN}`,
        //             "Content-Type": "application/json",
        //         },
        //     },
        // );
        const res = await axios.post(
            `https://graph.facebook.com/v22.0/${PHONE_NUMBER_ID}/messages`,
            {
                messaging_product: "whatsapp",
                to: OWNER_PHONE,
                type: "text",
                text: { body: message }
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
            to: OWNER_PHONE,
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

        const doc = new PDFDocument({ margin: 40, size: "A4" });
        doc.pipe(fs.createWriteStream(filePath));

        /* ---------------- HEADER ---------------- */
        const logoPath = path.join("public/images/orebiLogo.png");
        if (fs.existsSync(logoPath)) {
            doc.image(logoPath, 40, 40, { width: 70 });
        }

        doc
            .fontSize(20)
            .text("WOLZAA FASHION", 120, 45)
            .fontSize(10)
            .text("Surat, Gujarat, India", 120, 70)
            .text("support@wolzaa.com", 120, 85);

        doc.moveDown(2);

        /* ---------------- INVOICE INFO ---------------- */
        doc
            .fontSize(16)
            .text("INVOICE", { align: "right" })
            .fontSize(10)
            .text(`Invoice No: ${order.orderId}`, { align: "right" })
            .text(`Date: ${new Date().toLocaleDateString()}`, { align: "right" });

        doc.moveDown();

        /* ---------------- CUSTOMER INFO ---------------- */
        let customerAddress = order.street + ", " + order.city + " - " + order.zipcode + ", " + order.state + ", " + order.country;
        doc.fontSize(12).text("Bill To:");
        doc.fontSize(10)
            .text(`Customer Name: ${order.customerName}`)
            .text(`Address: ${customerAddress}`)
            .text(`Phone: ${order.phone}`);

        doc.moveDown();

        /* ---------------- TABLE HEADER ---------------- */
        const itemX = 40;
        const qtyX = 340;
        const priceX = 400;
        const totalX = 470;

        let y = doc.y;

        doc.fontSize(11).text("Item", itemX, y);
        doc.text("Qty", qtyX, y);
        doc.text("Price", priceX, y);
        doc.text("Total", totalX, y);

        doc.moveTo(40, y + 15).lineTo(550, y + 15).stroke();
        y += 25;

        /* ---------------- ITEMS ---------------- */
        let subtotal = 0;

        order.items.forEach((item) => {
            const itemTotal = item.quantity * item.price;
            subtotal += itemTotal;

            // Wrap long product names
            const itemHeight = doc.heightOfString(item.name, {
                width: qtyX - itemX - 10,
            });

            const rowHeight = Math.max(itemHeight, 20);

            doc.fontSize(10).text(item.name, itemX, y, {
                width: qtyX - itemX - 10,
            });

            doc.text(item.quantity, qtyX, y);
            doc.text(`Rs. ${item.price.toFixed(2)}`, priceX, y);
            doc.text(`Rs. ${itemTotal.toFixed(2)}`, totalX, y);

            y += rowHeight + 5;

            // Multi-page support
            if (y > doc.page.height - 120) {
                doc.addPage();
                y = 40;
            }
        });

        /* ---------------- CALCULATIONS ---------------- */
        const gstRate = 0.18;
        const gstAmount = subtotal * gstRate;
        const shipping = order.shippingCharge || 0;
        const grandTotal = subtotal + gstAmount + shipping;

        doc.moveTo(300, y).lineTo(550, y).stroke();
        y += 10;

        doc.fontSize(10);
        doc.text(`Subtotal: Rs. ${subtotal.toFixed(2)}`, 350, y);
        y += 15;
        doc.text(`GST (18%): Rs. ${gstAmount.toFixed(2)}`, 350, y);
        y += 15;
        doc.text(`Shipping: Rs. ${shipping.toFixed(2)}`, 350, y);
        y += 15;

        doc.fontSize(12).text(`Grand Total: Rs. ${grandTotal.toFixed(2)}`, 350, y);

        /* ---------------- FOOTER (CENTER FIX) ---------------- */
        doc.moveDown(3);
        doc.text(
            "Thank you for shopping with WOLZAA!",
            40,
            doc.page.height - 80,
            { align: "center", width: doc.page.width - 80 }
        );

        doc.text(
            "This is a computer-generated invoice.",
            40,
            doc.page.height - 65,
            { align: "center", width: doc.page.width - 80 }
        );

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
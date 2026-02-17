import express from 'express';
import { setIsRunning, getIsRunning } from '../isRunning.js';
import pool from '../config/dbConfig.js';
import buildLecturesXlsxBuffer from '../excel/export.js';

let lastMessage = "";

// Start recording
export const startRecording = async (req, res) => {
    setIsRunning(true);
    res.json({ message: 'Recording started' });
};

// Stop recording
export const stopRecording = async (req, res) => {
    setIsRunning(false);
    res.json({ message: 'Recording stopped' });
};

// Status recording
export const statusRecording = async (req, res) => {
    res.json({ isRunning: getIsRunning() });
};

// Send message
export const sendMessage = async (req, res) => {
    const { message } = req.body;

    console.log("Received message: " + message);

    lastMessage = message;

    res.status(200).json({ 
    status: 'success', 
    msg: 'Mensaje registrado correctamente',
    data: message 
  });
}

// Get message
export const getMessage = async (req, res) => {
    res.status(200).json({ 
    message: lastMessage,
  });
}

// Save recording
export const saveRecording = async (req, res, next) => {
    try {
        const result = await pool.query('SELECT * FROM lectures');
        const lectures = result.rows;
        const buffer = buildLecturesXlsxBuffer(lectures);

        res.set({
        'Content-Type':
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="lectures.xlsx"',
        'Content-Length': buffer.length,
        'Cache-Control': 'no-store',
        });
        res.send(buffer);
    } catch (err) {
        next(err);
    }
};
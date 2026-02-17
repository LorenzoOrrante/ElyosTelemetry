import dotenv from 'dotenv';

dotenv.config({ path: '../env/.env' });

// Check who's admin to control the buttons
export const checkControl = async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // Comparamos el token que envió el navegador con el del .env
    if (token === process.env.CONTROLLER_TOKEN) {
        res.json({ canControl: true });
    } else {
        res.json({ canControl: false });
    }
}
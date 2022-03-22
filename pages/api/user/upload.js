import XLSX from "xlsx";
import formidable from "formidable";
import { getSession } from "next-auth/react";
import { isNull } from 'lodash';

// Disable `bodyParser` to consume as stream
export const config = {
    api: {
        bodyParser: false
    }
};

export default async function handler(req, res) {
    const form = new formidable.IncomingForm();
    const session = await getSession({req});
    if (isNull(session)) {
        responseData.error = 'Devi essere loggato';
        res.status(401).json(responseData);
    }
    try {
        // Promisified `form.parse`
        const jsonData = await new Promise(function (resolve, reject) {
            form.parse(req, async (err, fields, files) => {
                if (err) {
                    reject(err);
                    return;
                }

                try {
                    //const data = await files.file.arrayBuffer();
                    /* data is an ArrayBuffer */
                    const file = files.file;
                    const workbook = XLSX.readFile(file.filepath);
                    const sheet = workbook.Sheets[workbook.SheetNames[0]];
                    const jsonSheet = XLSX.utils.sheet_to_json(sheet);
                    const data = {
                        status: true,
                        message: "File caricato correttamente",
                        payload: {
                            name: file.name,
                            mimetype: file.mimetype,
                            size: file.size,
                        },
                        sheet: jsonSheet
                    }
                    //const jsonSheet = {files: files}
                    resolve(data);
                } catch (err) {
                    reject(err);
                }
            });
        });
        
        return res.status(200).json(jsonData);
    } catch (err) {
        console.error("Error while parsing the form", err);
        return res.status(500).json({ error: err });
    }
}
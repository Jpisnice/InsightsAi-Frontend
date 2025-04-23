OCR with PDF

    python
    typescript
    curl

import { Mistral } from '@mistralai/mistralai';

const apiKey = process.env.MISTRAL_API_KEY;
const client = new Mistral({apiKey: apiKey});

const ocrResponse = await client.ocr.process({
    model: "mistral-ocr-latest",
    document: {
        type: "document_url",
        documentUrl: "https://arxiv.org/pdf/2201.04234"
    },
    includeImageBase64: true
});

Example output:
OCR with uploaded PDF

You can also upload a PDF file and get the OCR results from the uploaded PDF.
Upload a file

    python
    typescript
    curl

import { Mistral } from '@mistralai/mistralai';
import fs from 'fs';

const apiKey = process.env.MISTRAL_API_KEY;

const client = new Mistral({apiKey: apiKey});

const uploaded_file = fs.readFileSync('uploaded_file.pdf');
const uploaded_pdf = await client.files.upload({
    file: {
        fileName: "uploaded_file.pdf",
        content: uploaded_file,
    },
    purpose: "ocr"
});

Retrieve File

    python
    typescript
    curl

await client.files.retrieve({
    fileId: uploaded_pdf.id
});

id='00edaf84-95b0-45db-8f83-f71138491f23' object='file' size_bytes=3749788 created_at=1741023462 filename='uploaded_file.pdf' purpose='ocr' sample_type='ocr_input' source='upload' deleted=False num_lines=None

Get signed URL

    python
    typescript
    curl

const signedUrl = await client.files.getSignedUrl({
    fileId: uploaded_pdf.id,
});

Get OCR results

    python
    typescript
    curl

import { Mistral } from '@mistralai/mistralai';

const apiKey = process.env.MISTRAL_API_KEY;
const client = new Mistral({apiKey: apiKey});

const ocrResponse = await client.ocr.process({
    model: "mistral-ocr-latest",
    document: {
        type: "document_url",
        documentUrl: signedUrl.url,
    }
});

OCR with image

    python
    typescript
    curl

import { Mistral } from '@mistralai/mistralai';

const apiKey = process.env.MISTRAL_API_KEY;
const client = new Mistral({apiKey: apiKey});

const ocrResponse = await client.ocr.process({
    model: "mistral-ocr-latest",
    document: {
        type: "image_url",
        imageUrl: "https://raw.githubusercontent.com/mistralai/cookbook/refs/heads/main/mistral/ocr/receipt.png",
    }
});

Document understanding

The Document understanding capability combines OCR with large language model capabilities to enable natural language interaction with document content. This allows you to extract information and insights from documents by asking questions in natural language.

The workflow consists of two main steps:

    Document Processing: OCR extracts text, structure, and formatting, creating a machine-readable version of the document.

    Language Model Understanding: The extracted document content is analyzed by a large language model. You can ask questions or request information in natural language. The model understands context and relationships within the document and can provide relevant answers based on the document content.

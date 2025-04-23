"use client";
import React, { useState, useRef } from "react";
import { Zone } from "@/components/blocks/zone";
import { SearchComponent } from "@/components/blocks/search-bar";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { UploadIcon } from "@radix-ui/react-icons";

// Sample document interface matching what Zone expects
interface DocItem {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  file: File | null;
}

const DummyPage = ( ) => {

//Get the user



  //Search Data
  const searchData = [
    {
      id: 1,
      fileName: "quarterly_report_2023.pdf",
      title: "Q3 Financial Analysis",
      description: 
        "The third quarter showed a 15% increase in revenue compared to Q2. Market expansion in the APAC region contributed significantly to this growth.",
      tags: ["financial", "quarterly", "revenue", "growth", "2023"],
    },
    {
      id: 2,
      fileName: "system_architecture.docx",
      title: "Backend Infrastructure Design",
      description:
        "Microservice architecture using containerized deployments with Kubernetes. Each service communicates via REST APIs and message queues.",
      tags: ["technical", "architecture", "kubernetes", "microservice", "design"],
    },
    {
      id: 3,
      fileName: "environmental_impact_study.pdf",
      title: "Carbon Footprint Assessment",
      description:
        "Analysis of the organization's carbon emissions from 2020-2023. Recommendations include transitioning to renewable energy sources and optimizing supply chain logistics.",
      tags: ["environment", "carbon", "emissions", "sustainability", "report"],
    },
    {
      id: 4,
      fileName: "blockchain_whitepaper.pdf",
      title: "Distributed Ledger Implementation",
      description:
        "Proposed framework for implementing a permissioned blockchain network to enhance data security and transaction verification across organizational units.",
      tags: ["blockchain", "security", "cryptography", "distributed", "ledger"],
    },
    {
      id: 5,
      fileName: "recruitment_analytics.xlsx",
      title: "Hiring Metrics Dashboard",
      description:
        "Statistical breakdown of recruitment channels, conversion rates, and time-to-hire metrics for the past 6 months. Key insights on most effective sourcing methods.",
      tags: ["recruitment", "metrics", "analytics", "hiring", "statistics"],
    },
  ];

  // Initial sample documents in normal zone
  const [documents, setDocuments] = useState<DocItem[]>([
    {
      id: "doc1",
      fileName: "project-proposal.pdf",
      fileType: "pdf",
      fileSize: 2.5 * 1024 * 1024, // 2.5MB
      file: null,
    },
    {
      id: "doc2",
      fileName: "budget-2023.xlsx",
      fileType: "xlsx",
      fileSize: 1.2 * 1024 * 1024, // 1.2MB
      file: null,
    },
    {
      id: "doc3",
      fileName: "team-photo.jpg",
      fileType: "jpg",
      fileSize: 3.7 * 1024 * 1024, // 3.7MB
      file: null,
    },
  ]);

  // Initial sample documents in priority zone
  const [priorityDocuments, setPriorityDocuments] = useState<DocItem[]>([
    {
      id: "doc4",
      fileName: "URGENT-presentation.docx",
      fileType: "docx",
      fileSize: 1.8 * 1024 * 1024, // 1.8MB
      file: null,
    },
  ]);

  const [open, setOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // New state for preview
  const [previewContent, setPreviewContent] = useState<string>("");
  const [showPreview, setShowPreview] = useState(false);

  // Handle normal documents changes
  const handleDocumentsChange = (updatedDocs: DocItem[]) => {
    console.log("Normal documents updated:", updatedDocs);
    setDocuments(updatedDocs);
  };

  // Handle priority documents changes
  const handlePriorityDocumentsChange = (updatedDocs: DocItem[]) => {
    console.log("Priority documents updated:", updatedDocs);
    setPriorityDocuments(updatedDocs);
  };

  // Updated: Handle document selection to preview markdown file
  const handleDocumentSelect = (doc: DocItem) => {
    console.log("Document selected:", doc);
    if (doc.file && doc.fileType === "md") {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewContent(reader.result as string);
        setShowPreview(true);
      };
      reader.readAsText(doc.file);
    }
    // ...other selection logic...
  };

  // Add a new sample document to normal zone
  const addSampleDocument = () => {
    const newId = `doc${documents.length + priorityDocuments.length + 1}`;
    const fileTypes = ["pdf", "docx", "xlsx", "txt", "jpg"];
    const randomType = fileTypes[Math.floor(Math.random() * fileTypes.length)];
    const randomSize = (Math.random() * 5 + 0.5) * 1024 * 1024; // Random size between 0.5MB and 5.5MB

    const newDoc: DocItem = {
      id: newId,
      fileName: `sample-document-${newId}.${randomType}`,
      fileType: randomType,
      fileSize: randomSize,
      file: null,
    };

    setDocuments([...documents, newDoc]);
  };

  // Updated: Handle file upload using Mistral's OCR conversion
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/mistral-convert", { // updated endpoint
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      // data.pages is an array; combine markdown from all pages.
      const compiledMd = data.pages.map((page: any) => page.markdown).join("\n\n");
      const mdFile = new File([compiledMd], `${file.name.split(".")[0]}.md`, { type: "text/markdown" });
      const newDoc: DocItem = {
        id: `doc${documents.length + priorityDocuments.length + 1}`,
        fileName: `${file.name.split(".")[0]}.md`,
        fileType: "md",
        fileSize: mdFile.size,
        file: mdFile,
      };
      setDocuments([...documents, newDoc]);
    } catch (error) {
      console.error("Conversion failed:", error);
    }
  };

  // Update Upload Document button click to trigger hidden input
  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="container mx-auto p-6 w-screen ">
      <Drawer open={open} onOpenChange={setOpen}>
        <h1 className="text-2xl font-bold mb-6">Semantic Search Tool</h1>
        <div className="m-5">
          <div className="p-6 w-full">
            <SearchComponent data={searchData} />
          </div>

          {/* centered buttons */}
            <div className="mb-8 flex justify-center">
            <DrawerTrigger asChild>
              <Button variant="outline" onClick={triggerFileSelect}>
              <UploadIcon />
              </Button>
            </DrawerTrigger>
            </div>
        </div>
        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        {/* drawer to show docs section */}

        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle className="text-xl">Document base</DrawerTitle>
            <DrawerDescription>
            
                Add your documents here for Semantic search{" "}
                <br />
              
              <span className="italic">
                use the priority zone to process documents and gather better
                context (time intensive)
              </span>
            </DrawerDescription>
            
          </DrawerHeader>
          {/* <ProfileForm className="px-4" /> */}
          <div className="mb-4 p-4">
              <Button onClick={addSampleDocument} variant={"outline"}>
                Upload Document
              </Button>
            </div>
          <div className="m-2">
            <Zone
              documents={documents}
              priorityDocuments={priorityDocuments}
              onDocumentsChange={handleDocumentsChange}
              onPriorityDocumentsChange={handlePriorityDocumentsChange}
              onDocumentSelect={handleDocumentSelect}
            />
          </div>

          <DrawerFooter className="pt-2 mb-4">
            <DrawerClose asChild>
                <div className="flex justify-center w-full">
                <Button
                  variant="outline"
                  className="w-fit items-center justify-center p-2 m-2"
                >
                  Done
                </Button>
                </div>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 max-w-3xl w-full">
            <h2 className="text-xl font-bold mb-2">Markdown Preview</h2>
            <pre className="whitespace-pre-wrap break-words border p-2 mb-4">
              {previewContent}
            </pre>
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              Close Preview
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DummyPage;


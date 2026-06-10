"use client";

import { useLoadingStore } from "@/lib/stores/useLoadingStore";
import Button from "@/ui/Button";
import Card from "@/ui/Card";
import Form, { FormField } from "@/ui/Form";
import Modal from "@/ui/Modal";
import { ArrowLeft, FolderPlus } from "lucide-react";
import { useEffect, useState } from "react";

interface Document {
  fileName: string;
  size: number;
  createdAt: string;
  url: string;
}

const fields: FormField[] = [
  {
    name: "document",
    label: "Upload Document",
    type: "file",
    accept: ".pdf,.doc,.docx,.png",
  },
];

export default function DocumentList() {
  const initialValues = {
    document_title: "",
    document: null as File | null,
  };
  const [values, setValues] = useState(initialValues);
  const [docs, setDocs] = useState<Document[]>([]);
  const { startLoading, stopLoading } = useLoadingStore();
  const [isOpenModal, setIsOpenModal] = useState(false);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        startLoading("Loading documents...");
        const res = await fetch(`/api/documents`);

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        console.log("🚀 ~ fetchTutorials ~ data:", data);

        setDocs(data);
      } catch (error) {
        console.error("Failed to fetch tutorials:", error);
      } finally {
        stopLoading();
      }
    };
    fetchDocuments();
  }, []);

  // const handleSubmit = async () => {
  //   try {
  //     startLoading("Uploading document...");
  //     const formData = new FormData();

  //     formData.append("document_title", values.document_title);
  //     formData.append("file", values.document);

  //     const response = await fetch("/api/documents/upload", {
  //       method: "POST",
  //       body: formData,
  //     });

  //     const result = await response.json();

  //     console.log(result);
  //   } catch (error) {
  //     console.error(error);
  //   } finally {
  //     stopLoading();
  //   }
  // };

  const handleSubmit = async () => {
    try {
      startLoading("Uploading document...");
      const formData = new FormData();

      formData.append("document_title", values.document_title);

      if (values.document) {
        formData.append("file", values.document);
      }

      await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
      });
    } catch (error) {
      console.error(error);
    } finally {
      stopLoading();
    }
  };

  const handleChange = (name: string, value: string | File | null) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addTasksSection = (
    <div className="div-panel">
      <div className="max-w-md mx-auto">
        <Form
          fields={fields}
          values={values}
          onChange={handleChange}
          // onSubmit={handleSubmit}
          submitText="Login"
          footer={
            <Button className="btn-primary w-full" onClick={handleSubmit}>
              Upload Document
            </Button>
          }
        />
      </div>
    </div>
  );

  return (
    <div className="justify-center items-center content-center mt-5">
      <div className="flex gap-4">
        <h1 className="text-4xl font-bold heading-secondary">Documents</h1>
        <Button
          className="btn-primary borderw-40"
          onClick={() => setIsOpenModal(true)}
          // disabled={loading}
          icon={<FolderPlus />}
        />
      </div>

      {!docs ? (
        <p>Loading documents...</p>
      ) : docs?.length > 0 ? (
        <div className="grid mt-5 gap-3 md:grid-cols-3">
          {docs.map((doc: Document) => (
            <Card
              key={doc.url}
              title={doc.fileName}
              onClick={() => window.open(`${doc.url}`)}
              // onClick={async () => await fetchEventsTasks(event)}
              floating
            ></Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col h-full items-center justify-center">
          <p className="paragraph-primary">No documents found.</p>
          <Button
            className="btn-secondary w-40"
            // onClick={() => {
            //   router.push("/events");
            // }}
            // disabled={loading}
            icon={<ArrowLeft />}
          >
            Create and event
          </Button>
        </div>
      )}
      <Modal
        isOpen={isOpenModal}
        onClose={() => setIsOpenModal(false)}
        title="Add Document"
      >
        {addTasksSection}
      </Modal>
    </div>
  );
}

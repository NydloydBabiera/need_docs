"use client";

import { useLoadingStore } from "@/lib/stores/useLoadingStore";
import { useNotificationStore } from "@/lib/stores/useNotificationStore";
import {
  DocumentPayload,
  getDocuments,
  uploadDocument,
} from "@/services/document.service";
import Button from "@/ui/Button";
import Card from "@/ui/Card";
import Form, { FormField } from "@/ui/Form";
import InputField from "@/ui/InputField";
import Modal from "@/ui/Modal";
import { ArrowLeft, FolderPlus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

interface Document {
  document_id: string;
  title: string;
  description: string;
  createdAt: string;
  filePath: string;
}

const fields: FormField[] = [
  {
    name: "title",
    label: "Document title",
    type: "text",
  },
  {
    name: "description",
    label: "Description",
    type: "textarea",
  },
  {
    name: "document",
    label: "Upload Document",
    type: "file",
    accept: ".pdf,.doc,.docx,.png",
  },
];

export default function DocumentList() {
  const initialValues = {
    title: "",
    description: "",
    document: null as File | null,
  };
  const [values, setValues] = useState(initialValues);
  // const [docs, setDocs] = useState([]);
  const [documents, setDocuments] = useState([] as Document[]);
  const [events, setEvents] = useState([]);
  const { startLoading, stopLoading } = useLoadingStore();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const showNotification = useNotificationStore(
    (state) => state.showNotification,
  );
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const validateForm = () => {
    for (const field of fields) {
      const value = values[field.name as keyof typeof values];

      if (field.name === "description") return true;

      if (!value || value.toString().trim() === "") {
        showNotification("Error", `${field.label} is required`, "error");
        return false;
      }
    }

    return true;
  };

  const fetchDocuments = async () => {
    try {
      startLoading("Loading documents...");

      const documents = await getDocuments();

      console.log("🚀 ~ fetchTutorials ~ data:", documents);

      setDocuments(documents);
    } catch (error) {
      console.error("Failed to fetch tutorials:", error);
    } finally {
      stopLoading();
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);
  // useEffect(() => {
  //   const fetchDocuments = async () => {
  //     try {
  //       startLoading("Loading documents...");
  //       const data = await fetchDocuments();

  //       console.log("🚀 ~ fetchTutorials ~ data:", data);

  //       setDocs(data);
  //     } catch (error) {
  //       console.error("Failed to fetch tutorials:", error);
  //     } finally {
  //       stopLoading();
  //     }
  //   };
  //   fetchDocuments();
  // }, []);

  const filteredDocuments = useMemo(() => {
    if (!searchTerm.trim()) {
      return documents;
    }

    const keyword = searchTerm.toLowerCase();

    return documents.filter((document) =>
      document.title.toLowerCase().includes(keyword),
    );
  }, [documents, searchTerm]);

  const handleSubmit = async () => {
    try {
      startLoading("Uploading document...");
      if (!validateForm()) return;

      const data = await uploadDocument(values as DocumentPayload);
      console.log("🚀 ~ handleSubmit ~ data:", data);
    } catch (error) {
      console.error(error);
    } finally {
      stopLoading();
      fetchDocuments();
    }
  };

  const handleChange = (name: string, value: string | File | null) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addTasksSection = (
    <div>
      <div className="max-w-md mx-auto">
        <Form
          fields={fields}
          values={values}
          onChange={handleChange}
          // onSubmit={handleSubmit}
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
    <div className="m-5">
      <div className="justify-center items-center content-center mt-5">
        <div className="flex gap-4">
          <h1 className="text-4xl font-bold heading-secondary">Documents</h1>
          <InputField
            type="email"
            placeholder="Search documents"
            className="input-field w-full"
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setSearchTerm(searchInput);
              }
            }}
          />
          <Button
            className="btn-primary borderw-40"
            onClick={() => setIsOpenModal(true)}
            // disabled={loading}
            icon={<FolderPlus />}
          />
        </div>

        {!filteredDocuments ? (
          <p>Loading documents...</p>
        ) : filteredDocuments?.length > 0 ? (
          <div className="grid mt-5 gap-3 md:grid-cols-3">
            {filteredDocuments.map((doc: Document) => (
              <Card
                key={doc.document_id}
                title={doc.title}
                subtitle={doc.description}
                onClick={() => window.open(`${doc.filePath}`)}
                // onClick={async () => await fetchEventsTasks(event)}
                floating
              ></Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col h-full items-center justify-center">
            <p className="paragraph-primary">No documents found.</p>
          </div>
        )}
      </div>

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

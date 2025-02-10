import React, { useState } from "react";
import FamilyDetails from "./Form/FamilyDetails";
import EducationalDetails from "./Form/EducationalDetails";
import BasicDetails from "./Form/BasicDetails";
import BatchDetails from "./Form/BatchRelatedDetails";
import DashboardSidebar from "./DashboardSidebar";

const FormDetailPage = () => {
  const [formOpen, setFormOpen] = useState("");

  const formDetails = [
    {
      id: "familyDetailsForm",
      title: "Family Details",
      description: "Fill out your family information in this section.",
      component: <FamilyDetails />,
    },
    {
      id: "educationalDetailsForm",
      title: "Educational Details",
      description: "Provide your educational background here.",
      component: <EducationalDetails />,
    },
    {
      id: "basicDetailsForm",
      title: "Basic Details",
      description: "Add your basic details in this section.",
      component: <BasicDetails />,
    },
    {
      id: "batchDetailsForm",
      title: "Batch Details",
      description: "Specify your batch-related information here.",
      component: <BatchDetails />,
    },
  ];

  return (
    <div className="grid grid-cols-12 h-screen bg-gray-100">
      <div className="col-span-2 bg-gray-900">
        <DashboardSidebar />
      </div>

      <div className="col-span-10 bg-white p-8 rounded-2xl shadow-xl overflow-auto">
        <h1 className="text-2xl font-bold text-gray-700 mb-6">Form Details</h1>

        <div id="accordion" className="space-y-4">
          {formDetails.map((form) => (
            <div key={form.id} className="bg-gray-50 border rounded-xl shadow-sm">
              <h2>
                <button
                  type="button"
                  className="flex items-center justify-between w-full p-5 font-semibold text-gray-600 border-b rounded-t-xl focus:ring-4 focus:ring-indigo-200 hover:bg-gray-100"
                  onClick={() =>
                    setFormOpen((prev) => (prev === form.id ? "" : form.id))
                  }
                  aria-expanded={formOpen === form.id}
                  aria-controls={form.id}
                >
                  <span>{form.title}</span>
                  <svg
                    className={`w-5 h-5 transform transition-transform duration-300 ${
                      formOpen === form.id ? "rotate-180" : ""
                    }`}
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 10 6"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5 5 1 1 5"
                    />
                  </svg>
                </button>
              </h2>
              {formOpen === form.id && (
                <div id={form.id} className="p-1 bg-white">
                  <p className="mb-4 text-gray-500">{form.description}</p>
                  <div className="rounded-md bg-gray-50 border">
                    {form.component}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FormDetailPage;

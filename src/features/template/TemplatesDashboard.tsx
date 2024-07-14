import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { z } from "zod";
import { v4 as uuid } from "uuid";
import { Template, templateSchema, templateStorageKey } from "./template";
import { AddIcon } from "../../common/icons";

function TemplatesDashboard() {
  const templates = useGetTemplates();

  return (
    <div className="flex flex-col items-center pt-20 px-10">
      <CreateTemplate />
      <h2 className="text-2xl font-bold mt-8 mb-2 self-start">Saved templates</h2>
      <div className="border-zinc-200 border-b-[5px] w-full mb-6"></div>
      <ListTemplates templates={templates} />
    </div>
  );
}

function CreateTemplate() {
  const nav = useNavigate();
  const onCreateTemplate = () => {
    const id = uuid();
    const template: Template = {
      id,
      templateName: "Untitled.liftyourgame",
      width: 91,
      height: 55,
      units: "mm",
      elements: [],
      changeLog: [],
    };
    const templates = JSON.parse(localStorage.getItem("templates") || "{}");
    const validatedTemplates = z.record(z.string(), templateSchema).parse(templates);
    validatedTemplates[template.id] = template;
    const str = JSON.stringify(validatedTemplates);
    localStorage.setItem("templates", str);
    nav(id);
  };

  return (
    <div className="w-fit">
      <div
        onClick={onCreateTemplate}
        className="flex flex-col items-center gap-2 border-[3px] border-dashed border-zinc-300 p-12 w-full rounded-lg shadow-black/20 shadow-lg"
      >
        <AddIcon size={52} className="fill-indigo-600" />
        <p className="font-bold">Create new template</p>
      </div>
    </div>
  );
}

function ListTemplates({ templates }: { templates: Template[] }) {
  return (
    <div className="grid grid-cols-3 grid-flow-col w-full gap-4">
      {templates.map(template => (
        <TemplateListItem key={template.id} {...template} />
      ))}
    </div>
  );
}

function TemplateListItem({ id, templateName }: { id: string; templateName: string }) {
  return (
    <div className="w-full aspect-video border-[1px] border-zinc-400 rounded-lg shadow-lg shadow-black/20">
      <div className="h-full flex items-end justify-center p-4">
        <Link to={id}>
          <p className="font-bold text-center">{templateName}</p>
        </Link>
      </div>
    </div>
  );
}

function useGetTemplates() {
  const [templates, setTemplates] = useState<Template[] | null>(null);
  useEffect(() => {
    if (!templates) {
      const templates = fetchTemplates();
      setTemplates(templates);
    }
  }, [templates]);

  return templates ? templates : [];
}

export default TemplatesDashboard;

function fetchTemplates(): Template[] {
  const templateData = JSON.parse(localStorage.getItem(templateStorageKey) || "{}");
  if (!templateData) return [];
  const templateMap = z.record(z.string(), templateSchema).parse(templateData);
  return Object.values(templateMap).map(template => {
    return template;
  });
}

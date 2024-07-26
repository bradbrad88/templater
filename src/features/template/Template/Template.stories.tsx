import { Meta, StoryObj } from "@storybook/react";

import Template from "./Template";

import { type Template as TemplateType } from "../template";

import { useState } from "react";

const meta: Meta<typeof Template> = {
  title: "Templates/Template",
  component: TemplateWrapper,
};

export default meta;

type Story = StoryObj<typeof meta>;
type TemplateProps = Parameters<typeof Template>[0];

function TemplateWrapper(args: Omit<TemplateProps, "onMoveElement" | "onSelectElement">) {
  const [template, setTemplate] = useState<TemplateType>(args.template);
  const [selectedElement, setSelectedElement] = useState<string | undefined>(
    args.selectedElement as string | undefined
  );

  const onMoveElement = (elementId: string, delta: { top: number; left: number }) => {
    setTemplate(prev => {
      return {
        ...prev,
        elements: prev.elements.map(el => {
          if (el.id !== elementId) return el;
          return {
            ...el,
            top: el.top + delta.top,
            left: el.left + delta.left,
          };
        }),
      };
    });
  };

  const onSelectElement = (elementId: string) => {
    setSelectedElement(elementId);
  };

  return (
    <Template
      {...args}
      template={template}
      onMoveElement={onMoveElement}
      onSelectElement={onSelectElement}
      selectedElement={selectedElement}
    />
  );
}

const template: TemplateType = {
  width: 60,
  height: 40,
  future: [],
  history: [],
  elements: [
    { id: "element-1", type: "text", fontSize: 22, dataHeader: "Title", top: 10, left: 10 },
    {
      id: "element-3",
      type: "text",
      fontSize: 18,
      dataHeader: "Description",
      top: 50,
      left: 10,
    },
  ],
  id: "template-1",
  units: "mm",
  templateName: "storybook template",
};

const data = {
  Title: "Title Text",
  Description: "Some descriptive text",
};

export const EditMode: Story = {
  args: {
    template,
    data,
    editMode: true,
    selectedElement: "element-1",
  },
  argTypes: {
    onMoveElement: {
      type: "function",
    },
  },
};

export const ViewMode: Story = {
  args: {
    template,
    data,
  },
};

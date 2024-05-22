import { Meta, StoryObj } from "@storybook/react";
import { Button } from "@repo/ui";

const meta: Meta<typeof Button> = {
  title: "Buttons",
  component: Button,
  argTypes: {},
};

export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: {
    children: "Button",
    size: "default",
    variant: "default",
  },
};

export const Destructive: Story = {
  args: {
    children: "Button",
    size: "default",
    variant: "destructive",
  },
};

export const Outline: Story = {
  args: {
    children: "Button",
    size: "default",
    variant: "outline",
  },
};

export const Secondary: Story = {
  args: {
    children: "Button",
    size: "default",
    variant: "secondary",
  },
};

export const Ghost: Story = {
  args: {
    children: "Button",
    size: "default",
    variant: "ghost",
  },
};

export const Link: Story = {
  args: {
    children: "Button",
    size: "default",
    variant: "link",
  },
};

export const Explore: Story = {
  args: {
    children: "Button",
    size: "default",
    variant: "explore",
  },
};

export const Small: Story = {
  args: {
    children: "Button",
    size: "sm",
    variant: "default",
  },
};

export const Large: Story = {
  args: {
    children: "Button",
    size: "lg",
    variant: "default",
  },
};

export const Icon: Story = {
  args: {
    children: "Button",
    size: "icon",
    variant: "default",
  },
};

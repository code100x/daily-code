"use client";
import { Button, toast } from "@repo/ui";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui";
import { Input } from "@repo/ui";
import { Label } from "@repo/ui";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { addCategory, deleteCategory } from "../utils";
import { useRouter } from "next/navigation";

const EditCategories = ({
  categories,
}: {
  categories: {
    id: string;
    category: string;
  }[];
}) => {
  const router = useRouter();
  const [newCategory, setNewCategory] = useState<string>("");
  async function handleAddCategory() {
    if (!newCategory) {
      toast({
        title: "Category cannot be empty",
        description: "Please enter a category",
      });
      return;
    }
    toast({
      title: "Adding category",
    });
    try {
      await addCategory(newCategory);
      router.refresh();
      toast({
        title: "Category added",
        description: `Category ${newCategory} added`,
      });
    } catch (error) {
      toast({
        title: "Error adding category",
      });
    }
  }
  async function handleDeleteCategory(categoryId: string) {
    toast({
      title: "Deleting category",
    });
    try {
      await deleteCategory(categoryId);
      router.refresh();
      toast({
        title: "Category deleted",
      });
    } catch (error) {
      toast({
        title: "Error deleting category",
      });
    }
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Edit categories</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <div className="grid gap-4 py-4">
          {categories.map((category) => (
            <div key={category.id} className="flex justify-between">
              <Label>{category.category}</Label>
              <Button onClick={() =>handleDeleteCategory(category.id)} variant={"outline"} size={"sm"}>
                <Trash2 size={16} />
              </Button>
            </div>
          ))}
        </div>
        <Input value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="Add new category" />
        <DialogFooter>
          <Button onClick={handleAddCategory}>Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditCategories;

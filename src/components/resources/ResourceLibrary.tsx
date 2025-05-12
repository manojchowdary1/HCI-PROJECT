
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, FileImage, FileVideo, Search, Plus, Download, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

interface Resource {
  id: string;
  name: string;
  type: string;
  subject: string;
  url: string;
  dateAdded: string;
}

export function ResourceLibrary() {
  const { toast } = useToast();
  const [resources, setResources] = useState<Resource[]>([
    {
      id: "1",
      name: "Mathematics Formula Sheet",
      type: "document",
      subject: "math",
      url: "#",
      dateAdded: "2023-05-10",
    },
    {
      id: "2",
      name: "Science Lab Report Template",
      type: "document",
      subject: "science",
      url: "#",
      dateAdded: "2023-05-08",
    },
    {
      id: "3",
      name: "History Timeline Diagram",
      type: "image",
      subject: "history",
      url: "#",
      dateAdded: "2023-05-05",
    },
    {
      id: "4",
      name: "Literature Analysis Guide",
      type: "document",
      subject: "literature",
      url: "#",
      dateAdded: "2023-05-01",
    },
    {
      id: "5",
      name: "Programming Tutorial Video",
      type: "video",
      subject: "computer",
      url: "#",
      dateAdded: "2023-04-28",
    },
  ]);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [newResource, setNewResource] = useState<Omit<Resource, "id" | "dateAdded">>({
    name: "",
    type: "document",
    subject: "math",
    url: "",
  });
  const [dialogOpen, setDialogOpen] = useState(false);

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === "all" || resource.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "document":
        return <FileText className="h-6 w-6 text-blue-500" />;
      case "image":
        return <FileImage className="h-6 w-6 text-green-500" />;
      case "video":
        return <FileVideo className="h-6 w-6 text-red-500" />;
      default:
        return <FileText className="h-6 w-6 text-gray-500" />;
    }
  };

  const handleAddResource = () => {
    if (!newResource.name || !newResource.url) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const resource: Resource = {
      ...newResource,
      id: uuidv4(),
      dateAdded: new Date().toISOString().split('T')[0],
    };

    setResources([resource, ...resources]);
    setDialogOpen(false);
    setNewResource({
      name: "",
      type: "document",
      subject: "math",
      url: "",
    });

    toast({
      title: "Resource Added",
      description: "Your resource has been added successfully.",
    });
  };

  const handleDeleteResource = (id: string) => {
    setResources(resources.filter(resource => resource.id !== id));
    toast({
      title: "Resource Deleted",
      description: "The resource has been removed from your library.",
    });
  };

  const handleDownload = (resource: Resource) => {
    toast({
      title: "Download Started",
      description: `Downloading ${resource.name}...`,
    });
    // In a real app, this would trigger actual file download
    // For now, we'll just show a toast notification
  };

  return (
    <Tabs defaultValue="all" className="w-full">
      <div className="flex flex-col md:flex-row md:justify-between mb-6 gap-4">
        <TabsList className="grid grid-cols-3 w-full md:w-auto">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
        </TabsList>

        <div className="flex w-full md:w-auto gap-2">
          <div className="relative flex-grow">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search resources..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              <SelectItem value="math">Mathematics</SelectItem>
              <SelectItem value="science">Science</SelectItem>
              <SelectItem value="history">History</SelectItem>
              <SelectItem value="literature">Literature</SelectItem>
              <SelectItem value="computer">Computer Science</SelectItem>
              <SelectItem value="language">Languages</SelectItem>
            </SelectContent>
          </Select>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Resource
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Resource</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Resource Name</Label>
                  <Input 
                    id="name" 
                    value={newResource.name}
                    onChange={(e) => setNewResource({...newResource, name: e.target.value})}
                    placeholder="e.g. Chemistry Formula Sheet"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="type">Type</Label>
                    <Select 
                      value={newResource.type} 
                      onValueChange={(value) => setNewResource({...newResource, type: value})}
                    >
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="document">Document</SelectItem>
                        <SelectItem value="image">Image</SelectItem>
                        <SelectItem value="video">Video</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Select 
                      value={newResource.subject} 
                      onValueChange={(value) => setNewResource({...newResource, subject: value})}
                    >
                      <SelectTrigger id="subject">
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="math">Mathematics</SelectItem>
                        <SelectItem value="science">Science</SelectItem>
                        <SelectItem value="history">History</SelectItem>
                        <SelectItem value="literature">Literature</SelectItem>
                        <SelectItem value="computer">Computer Science</SelectItem>
                        <SelectItem value="language">Languages</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="url">URL / Link</Label>
                  <Input 
                    id="url" 
                    value={newResource.url}
                    onChange={(e) => setNewResource({...newResource, url: e.target.value})}
                    placeholder="https://..."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAddResource}>Add Resource</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <TabsContent value="all" className="m-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredResources.length > 0 ? (
            filteredResources.map((resource) => (
              <Card key={resource.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-start gap-3">
                    <div className="mt-1">{getResourceIcon(resource.type)}</div>
                    <div className="flex-1">{resource.name}</div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {resource.subject.charAt(0).toUpperCase() + resource.subject.slice(1)} • Added on {resource.dateAdded}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={() => handleDownload(resource)}
                    className="flex-1 mr-2"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => handleDeleteResource(resource.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <p className="text-muted-foreground">No resources found.</p>
            </div>
          )}
        </div>
      </TabsContent>
      
      <TabsContent value="documents" className="m-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredResources
            .filter(resource => resource.type === "document")
            .map((resource) => (
              <Card key={resource.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-start gap-3">
                    <div className="mt-1">{getResourceIcon(resource.type)}</div>
                    <div className="flex-1">{resource.name}</div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {resource.subject.charAt(0).toUpperCase() + resource.subject.slice(1)} • Added on {resource.dateAdded}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={() => handleDownload(resource)}
                    className="flex-1 mr-2"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => handleDeleteResource(resource.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
        </div>
      </TabsContent>
      
      <TabsContent value="media" className="m-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredResources
            .filter(resource => ["image", "video"].includes(resource.type))
            .map((resource) => (
              <Card key={resource.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-start gap-3">
                    <div className="mt-1">{getResourceIcon(resource.type)}</div>
                    <div className="flex-1">{resource.name}</div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {resource.subject.charAt(0).toUpperCase() + resource.subject.slice(1)} • Added on {resource.dateAdded}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={() => handleDownload(resource)}
                    className="flex-1 mr-2"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => handleDeleteResource(resource.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
        </div>
      </TabsContent>
    </Tabs>
  );
}

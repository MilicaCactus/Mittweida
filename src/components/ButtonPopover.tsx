import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {PlusIcon} from "@/assets/Icons.tsx";
import {useEffect, useState} from "react";
import {supabase} from "@/lib/supabase.ts";

export function UploadDialog() {
    const [file, setFile] = useState<File>();
    function uploadImage(){
        const input = document.createElement("input");
        input.type = "file";
        input.hidden = true;
        input.accept = "image/*";
        document.body.appendChild(input);
        input.click()
        input.multiple = false
        input.onchange = (ev) => {
            setFile(ev.target!.files[0])
        }
    }
    async function onSubmit(){

    }

    return (
        <Dialog>
            <form>
                <DialogTrigger className={"cursor-pointer"}>
                    <PlusIcon />
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Create Post</DialogTitle>
                        <DialogDescription>
                            Make changes to your profile here. Click save when you&apos;re
                            done.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
                        <div className="grid gap-3 *:select-none">
                            <Tabs>
                                <TabsList defaultValue={"gallery"} className={"w-full cursor-pointer"}>
                                    <TabsTrigger value="gallery">Gallery</TabsTrigger>
                                    <TabsTrigger value="camera">Camera</TabsTrigger>
                                </TabsList>
                                <TabsContent value="gallery">
                                    {file ? <div className={"flex flex-col gap-y-2"}><img className={"rounded-sm"} src={URL.createObjectURL(file)} /><Button onClick={()=>setFile()} className={"mx-auto"}>Remove Image</Button></div> : <div className="bg-gray-100 relative min-h-24 rounded-md" onClick={uploadImage}>
                                        {!file && <span
                                            className="absolute h-fit w-fit text-black/60 right-0 left-0 top-0 bottom-0 m-auto">Upload an Image</span>}
                                    </div>}
                                </TabsContent>
                                <TabsContent value="camera">
                                    <Camera />
                                </TabsContent>
                            </Tabs>
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="name-1">Title</Label>
                            <Input id="name-1" name="name" defaultValue="Pedro Duarte" />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="username-1">Description</Label>
                            <Input id="username-1" name="username" defaultValue="@peduarte" />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit">Save changes</Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}

function Camera(){
    const [cameraAccess, setCameraAccess] = useState<boolean|null>(null)
    function takePicture() {
        const [width, height] = [720, 0]
        const canvas = document.getElementById("photo") as HTMLCanvasElement
        const context = canvas.getContext("2d")!
        if (width && height) {
            canvas.width = width;
            canvas.height = height;
            context.drawImage(video, 0, 0, width, height);

            const data = canvas.toDataURL("image/png");
            console.log(data)
        } else {
            clearPhoto();
        }
    }
    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: false })
            .then((stream) => {
                setCameraAccess(true)
                const video = document.getElementById("video")!
                video.srcObject = stream;
                video.play();
                video.addEventListener(
                    "canplay",
                    (ev) => {
                        if (!streaming) {
                            height = video.videoHeight / (video.videoWidth / width);

                            // Firefox currently has a bug where the height can't be read from
                            // the video, so we will make assumptions if this happens.
                            if (isNaN(height)) {
                                height = width / (4 / 3);
                            }

                            video.setAttribute("width", width);
                            video.setAttribute("height", height);
                            canvas.setAttribute("width", width);
                            canvas.setAttribute("height", height);
                            streaming = true;
                        }
                    },
                    false,
                );
            })
            .catch((error) => {
                console.log(error)
                if (error.name === 'NotAllowedError'){
                    setCameraAccess(false)
                }
            });
    }, []);
    if (cameraAccess === null) return (
        <div className="bg-gray-100 relative min-h-24 rounded-md">
            <span className="absolute h-fit w-fit text-black/60 right-0 left-0 top-0 bottom-0 m-auto">
            Requesting camera permission...
                </span>
        </div>
    );
    if (cameraAccess === false) return (
        <div className="bg-gray-100 relative min-h-24 rounded-md">
            <span className="absolute h-fit w-fit text-black/60 right-0 left-0 top-0 bottom-0 m-auto">
                You have not given permission for the camera.
            </span>
        </div>
    );
    if (cameraAccess === true) return (
        <div>
            <canvas id="photo"></canvas>
            <video id="video">Video stream not available.</video>
            <Button onClick={takePicture}>Take a Photo</Button>
        </div>
    );

}

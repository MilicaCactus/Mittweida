import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
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
import {useEffect, useRef, useState} from "react";
import {supabase} from "@/lib/supabase.ts";
import { useAuth } from "./hooks/LoginProvider"
import {v4 as uuidv4} from "uuid"

export function UploadDialog() {
    const [file, setFile] = useState<File>();
    const [error, setError] = useState<string|null>(null);
    const {guard, user} = useAuth();
    const [open, setOpen] = useState<boolean>(false);
    const [post, setPost] = useState({
        title: "",
        description: "",
        image_url: null,
    })
    const handleClick = guard(() => {
        setOpen(true);
    });

    function uploadImage(){
        const input = document.createElement("input");
        input.type = "file";
        input.hidden = true;
        input.accept = "image/*";
        document.body.appendChild(input);
        input.click()
        input.multiple = false
        input.onchange = (ev) => {
        }
    }
    async function onSubmit(e){
        if (!file){
            setError("You need to attach a file!")
            return
        }
        const {data, error} = await supabase.from("posts").insert({
            ...post,
            user_id: user!.id,
        }).select().single()
        if (data.id){
            const filePath = `${data.id}`;
            const {error: uploadError} = await supabase.storage.from("images").upload(filePath, file, {
                contentType: file.type,
            });
            if (uploadError) {
                setError(uploadError.message);
                return;
            }
            const {data: imageData} = await supabase.storage.from("images").getPublicUrl(filePath);
            if (imageData.publicUrl) {
                await supabase.from("posts").update({image_url: imageData.publicUrl}).eq("id", data.id);
                setPost({...post});
            }
            setTimeout(()=>{
                window.location.reload();
            }, 1000)
        }
        // setError(null)
        // const {data, error} = await supabase.storage.from('images').upload('file_path', new Blob([file], { type: file.type }), {
        //     contentType: file.type,
        // })
        // if (error){
        //     setError(error.message)
        // }
        // if (data){
        //     await continueUpload(data)
        // }
    }
    async function continueUpload(){

    }

    return (
        <>
        <div onClick={handleClick} className={"cursor-pointer"}>
            <PlusIcon />
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
            <form>
                <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
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
                                    {file ? <div className={"flex flex-col gap-y-2"}><img className={"rounded-sm"} src={URL.createObjectURL(file)} /><Button className={"mx-auto"}>Remove Image</Button></div> : <div className="bg-gray-100 relative min-h-24 rounded-md" onClick={uploadImage}>
                                        {!file && <span
                                            className="absolute h-fit w-fit text-black/60 right-0 left-0 top-0 bottom-0 m-auto">Upload an Image</span>}
                                    </div>}
                                </TabsContent>
                                <TabsContent value="camera">
                                    <Camera file={file} setFile={setFile} />
                                </TabsContent>
                            </Tabs>
                        </div>
                        {error && <span className={"text-red-400/80"}>{error}</span>}
                        <div className="grid gap-3">
                            <Label htmlFor="title">Title</Label>
                            <Input id="title" name="title" value={post.title} onChange={(e)=>setPost({...post, title: e.target.value})} defaultValue="Mittweida" />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="desc">Description</Label>
                            <Input id="desc" name="desc" value={post.description} onChange={(e)=>setPost({...post, description: e.target.value})} defaultValue="@peduarte" />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button className={"cursor-pointer"} type={"submit"} onClick={guard(onSubmit)}>Post</Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
        </>
    )
}

export function Camera({ file, setFile }) {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const [cameraAccess, setCameraAccess] = useState<boolean | null>(null);
    const [streaming, setStreaming] = useState(false);
    const width = 720;

    function dataURLToFile(dataUrl: string, filename: string): File {
        const arr = dataUrl.split(",");
        const mime = arr[0].match(/:(.*?);/)![1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) u8arr[n] = bstr.charCodeAt(n);
        return new File([u8arr], filename, { type: mime });
    }

    async function takePicture() {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        if (!video || !canvas) return;

        let height = video.videoHeight / (video.videoWidth / width);
        if (isNaN(height)) height = width / (4 / 3);

        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext("2d")!;
        context.drawImage(video, 0, 0, width, height);

        const dataUrl = canvas.toDataURL("image/png");
        const file = dataURLToFile(dataUrl, "photo.png");

        setFile(file);

        // Stop the stream after capturing photo
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
        }
    }

    async function startStream() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
            streamRef.current = stream;
            setCameraAccess(true);
            const video = videoRef.current;
            if (video) {
                video.srcObject = stream;
                await video.play();

                let height = video.videoHeight / (video.videoWidth / width);
                if (isNaN(height)) height = width / (4 / 3);

                video.setAttribute("width", `${width}`);
                video.setAttribute("height", `${height}`);
                canvasRef.current?.setAttribute("width", `${width}`);
                canvasRef.current?.setAttribute("height", `${height}`);

                setStreaming(true);
            }
        } catch (error: any) {
            console.error(error);
            if (error.name === "NotAllowedError") {
                setCameraAccess(false);
            }
        }
    }

    useEffect(() => {
        startStream();

        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => track.stop());
            }
        };
    }, []);

    function handleClear() {
        setFile(null);
        startStream(); // restart stream when clearing the photo
    }

    if (cameraAccess === null)
        return (
            <div className="bg-gray-100 relative min-h-24 rounded-md">
                <span className="absolute h-fit w-fit text-black/60 right-0 left-0 top-0 bottom-0 m-auto">
                    Requesting camera permission...
                </span>
            </div>
        );

    if (cameraAccess === false)
        return (
            <div className="bg-gray-100 relative min-h-24 rounded-md">
                <span className="absolute h-fit w-fit text-black/60 right-0 left-0 top-0 bottom-0 m-auto">
                    You have not given permission for the camera.
                </span>
            </div>
        );

    return (
        <div className="flex flex-col items-center">
            <canvas ref={canvasRef} className="hidden" />
            {file ? (
                <img
                    className="rounded-sm mb-2"
                    src={URL.createObjectURL(file)}
                    alt="Captured"
                />
            ) : (
                <video className="rounded-sm mb-2" ref={videoRef}>
                    Video stream not available.
                </video>
            )}
            {file ? (
                <Button onClick={handleClear}>Clear Photo</Button>
            ) : (
                <Button onClick={takePicture}>Take a Photo</Button>
            )}
        </div>
    );
}

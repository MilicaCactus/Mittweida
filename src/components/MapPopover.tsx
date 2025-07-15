import {CurrentLocationMap, type MarkerProps} from "@/components/map/map.tsx";
import {Dialog, DialogContent} from "@/components/ui/dialog.tsx";
import type { Dispatch, SetStateAction } from "react";

export default function MapPopover({markers, open, setOpen} : {markers : MarkerProps, open : boolean, setOpen :  Dispatch<SetStateAction<boolean>>}){
    return (
        <Dialog open={open} onOpenChange={(e)=>setOpen(e)}>
            <DialogContent>
                <CurrentLocationMap routing={true} />
            </DialogContent>
        </Dialog>
    )
}
import {useEffect, useState} from "react"
import {supabase} from "../lib/supabase.ts"
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {DialogContent, DialogTitle, DialogHeader, Dialog} from "@/components/ui/dialog.tsx";
import {useIsLoggedIn} from "@/components/hooks/LoginProvider.tsx";

export default function Auth() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {openAuth} = useIsLoggedIn()
    useEffect(() => {
        console.log(openAuth?.open)
    }, [openAuth]);
    const handleSignUp = async () => {
        const {error} = await supabase.auth.signUp({
            email,
            password,
        })
        if (error) {
            alert(error.message)
        }
        else {
            alert("Sign up successfully")
        }
    }
    const handleLogin = async () => {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) alert(error.message);
        else {

        }
    };

    return (
        <Dialog open={!!(openAuth?.fn)}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Login</DialogTitle>
                </DialogHeader>
                <div className="p-2">
                    <Input
                        className="border p-2 mb-2 h-12 w-full"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Input
                        className="border p-2 mb-2 h-12 w-full"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <div className="flex flex-row justify-between py-2">
                        <Button className="bg-black text-white w-24 cursor-pointer" onClick={handleSignUp}>
                            Sign Up
                        </Button>
                        <Button className="bg-blue-500 hover:bg-blue-400 cursor-pointer text-white w-24" onClick={handleLogin}>
                            Sign In
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
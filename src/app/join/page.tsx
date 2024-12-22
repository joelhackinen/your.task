import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { SignUpForm } from "./signup-form";
import { LoginForm } from "./login-form";
import { getUser } from "@/_data/user";
import { redirect } from "next/navigation";
 
export default async function JoinPage() {
  const user = await getUser();
  if (user) return redirect("/");
  return (
    <Card className="w-full max-w-lg mx-auto p-6">
      <Tabs defaultValue="signup" className="">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signup">Sign up</TabsTrigger>
          <TabsTrigger value="login">Log in</TabsTrigger>
        </TabsList>
        <TabsContent value="signup">
          <Card>
            <CardHeader>
              <CardTitle>Sign up</CardTitle>
              <CardDescription>
                Stop being a pu$$y and create a damn Board!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <SignUpForm />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>
                Welcome back!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <LoginForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Card>
  );
};
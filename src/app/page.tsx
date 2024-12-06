import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateBoardDrawer } from "@/components/create-board-drawer";
import { JoinBoardDrawer } from "@/components/join-board-drawer";


const Home = () => {
  return (
    <div className="font-[family-name:var(--font-geist-sans)]">
      <Card className="container mx-auto">
        <CardHeader>
          <CardTitle>Welcome to your.task</CardTitle>
          <CardDescription>Easy all-purpose task board</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2 items-center">
            <CreateBoardDrawer />
            <JoinBoardDrawer />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Home;

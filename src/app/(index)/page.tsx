import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateBoardDrawer } from "@/app/(index)/create-board-drawer";
import { JoinBoardDrawer } from "@/app/(index)/join-board-drawer";


const Home = () => {
  return (
    <div className="font-[family-name:var(--font-geist-sans)]">
      <Card className="container mx-auto">
        <CardHeader className="text-center">
          <CardTitle>Welcome to your.task</CardTitle>
          <CardDescription>Easy all-purpose task board</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 items-center">
          <CreateBoardDrawer />
          <JoinBoardDrawer />
        </CardContent>
      </Card>
    </div>
  );
};

export default Home;

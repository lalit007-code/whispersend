import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { Message } from "@/model/user";

export async function POST(request: Request) {
  await dbConnect();
  const { username, content } = await request.json();
  try {
    const user = await UserModel.findOne({ username });

    if (!user) {
      return Response.json(
        {
          success: false,
          messages: "User not found",
        },
        { status: 404 }
      );
    }

    //is user accpeting message

    if (!user.isAcceptingMessage) {
      return Response.json(
        {
          success: false,
          messages: "User not accepting messages",
        },
        { status: 403 }
      );
    }

    const newMessage = { content, createdAt: new Date() };

    user.messages.push(newMessage as Message);
    await user.save();

    return Response.json(
      {
        success: true,
        messages: "Message send successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error while sending message", error);
    return Response.json(
      {
        success: false,
        messages: "Error while sending message",
      },
      { status: 500 }
    );
  }
}

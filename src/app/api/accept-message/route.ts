import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { User } from "next-auth";

export async function POST(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        meessage: "Not Authenticated",
      },
      {
        status: 401,
      }
    );
  }

  const user_Id = user._id;

  const { acceptMessages } = await request.json();

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      {
        user_Id,
      },
      { isAcceptingMessage: acceptMessages },
      {
        new: true,
      }
    );
    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "failed to update user status to accept message",
        },
        {
          status: 500,
        }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Message accepting status updated successfully",
        updatedUser,
      },
      {
        status: 401,
      }
    );
  } catch (error) {
    console.log("Failed to update user status to accpet message");
    return Response.json(
      {
        success: false,
        message: "failed to update user status to accept message",
      },
      {
        status: 401,
      }
    );
  }
}

export async function GET(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        meessage: "Not Authenticated",
      },
      {
        status: 401,
      }
    );
  }

  const user_Id = user._id;

  try {
    const foundUser = await UserModel.findById(user_Id);

    if (!foundUser) {
      return Response.json(
        {
          success: false,
          meessage: "user not found",
        },
        {
          status: 404,
        }
      );
    }
    return Response.json(
      {
        success: true,
        isAcceptingMessages: foundUser.isAcceptingMessage,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Failed to update user status to accpet message");
    return Response.json(
      {
        success: false,
        message: "Error (Getting Message Acceptance Status)",
      },
      {
        status: 500,
      }
    );
  }
}
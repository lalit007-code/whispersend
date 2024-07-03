import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { User, getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function DELETE(
  request: Request,
  { params }: { params: { messageid: string } }
) {
  const messageid = params.messageid;

  await dbConnect();
  const session = await getServerSession(authOptions);

  const user: User = session?.user as User;

  if (!session || !user) {
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

  try {
    const updatedResult = await UserModel.updateOne(
      {
        _id: user._id,
      },
      { $pull: { messages: { _id: messageid } } }
    );

    if (updatedResult.modifiedCount === 0) {
      return Response.json(
        {
          success: false,
          meessage: "Message not found or already deleted",
        },
        {
          status: 404,
        }
      );
    }

    return Response.json(
      {
        success: true,
        meessage: "Message deleted successfully",
      },
      {
        status: 401,
      }
    );
  } catch (error) {
    console.log("error deleting message", error);
    return Response.json(
      {
        success: false,
        meessage: "Error deleting message",
      },
      {
        status: 500,
      }
    );
  }
}

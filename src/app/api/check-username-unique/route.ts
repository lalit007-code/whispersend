import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { INVALID, z } from "zod";
import { usernameValidation } from "@/schema/signUpSchema";

//shcema for checking uniqueness for username
const usernameQuerySchema = z.object({
  username: usernameValidation,
});

//get method,checking username whenever user send it
export async function GET(request: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const queryParam = {
      username: searchParams.get("username"),
    };

    //doing zod validation

    const validUsername = usernameQuerySchema.safeParse(queryParam);

    //checking zod validation
    if (!validUsername.success) {
      const usernameErrors =
        validUsername.error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            usernameErrors.length > 0
              ? usernameErrors.join(", ")
              : "Invalid user name",
        },
        { status: 500 }
      );
    }
    const { username } = validUsername.data;

    const exisitingUserVerified = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (exisitingUserVerified) {
      return Response.json(
        {
          success: false,
          message: "Username is alredy taken",
        },
        { status: 500 }
      );
    }
    return Response.json(
      {
        success: true,
        message: "Username is unique",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error checking username", error);
    return Response.json(
      {
        success: false,
        message: "Error checking username",
      },
      {
        status: 500,
      }
    );
  }
}

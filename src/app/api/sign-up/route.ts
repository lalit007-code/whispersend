import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import bcrypt from "bcryptjs";

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

//signinAPI
export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, email, password } = await request.json();

    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUserVerifiedByUsername) {
      return Response.json(
        {
          success: false,
          message: "username is already taken",
        },
        {
          status: 400,
        }
      );
    }

    const existingUserByEmail = await UserModel.findOne({ email });

    //random verify code
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "User already exist with this email",
          },
          { status: 400 }
        );
      } else {
        const hashedPass = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPass;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 36000000);
        existingUserByEmail.username = username; //overriding username 

        await existingUserByEmail.save();
      }
    } else {
      const hashedPass = await bcrypt.hash(password, 10);

      const expireDate = new Date();
      expireDate.setHours(expireDate.getHours() + 1);

      const newUser = new UserModel({
        username,
        email,
        password: hashedPass,
        verifyCode,
        verifyCodeExpiry: expireDate,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });
      await newUser.save();
    }

    //send verification email

    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );

    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        {
          status: 500,
        }
      );
    }
    return Response.json(
      {
        succes: true,
        message: "User registered sucessfully.please verify you email",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Error registrating user", error);
    return Response.json(
      {
        message: "Error registering user",
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}

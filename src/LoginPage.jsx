import React from 'react';
import { SignIn } from "@clerk/clerk-react";

const LoginPage = () => {
  return (
    <div className="flex-grow flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <SignIn 
          routing="path" 
          path="/login" 
          afterSignInUrl="/dashboard"
          signUpUrl="/signup"
          appearance={{
            elements: {
              rootBox: "",
              card: "bg-neutral-900 border border-neutral-800",
              headerTitle: "text-white",
              headerSubtitle: "text-gray-400",
              socialButtonsBlockButton: "bg-neutral-800 border-neutral-700 text-white hover:bg-neutral-700",
              dividerLine: "bg-neutral-800",
              dividerText: "text-gray-400",
              formFieldLabel: "text-gray-300",
              formFieldInput: "bg-neutral-800 border-neutral-700 text-white",
              formButtonPrimary: "bg-purple-600 hover:bg-purple-700",
              footerActionLink: "text-purple-500 hover:text-purple-400",
              formFieldInputShowPasswordButton: "text-gray-400",
              otpCodeFieldInput: "!bg-neutral-800 !border-neutral-700 !text-white",
              footer: "bg-neutral-900 text-gray-400",
              footerText: "text-gray-400",
              footerActionText: "text-gray-400",
              footerPageLink: "text-purple-500 hover:text-purple-400",
              card__main: "bg-neutral-900",
              alternativeMethodsBlockButton: "bg-neutral-800 border-neutral-700 text-white hover:bg-neutral-700",
              identityPreviewText: "text-gray-400",
              identityPreviewEditButton: "text-purple-500 hover:text-purple-400",
              formResendCodeLink: "text-purple-500 hover:text-purple-400",
              alert: "bg-neutral-800 border-neutral-700 text-white",
              alertText: "text-gray-400",
              formFieldSuccessText: "text-green-500",
              formFieldErrorText: "text-red-500",
              selectButton: "bg-neutral-800 border-neutral-700 text-white hover:bg-neutral-700",
              selectButtonText: "text-white",
              selectOptionText: "text-gray-400"
            },
            layout: {
              socialButtonsPlacement: "bottom",
              showOptionalFields: false
            },
            variables: {
              colorPrimary: "#8B5CF6",
              colorBackground: "#171717",
              colorText: "#FFFFFF",
              colorTextSecondary: "#9CA3AF",
              colorDanger: "#EF4444",
              colorSuccess: "#10B981",
              borderRadius: "0.5rem"
            }
          }}
        />
      </div>
    </div>
  );
};

export default LoginPage;

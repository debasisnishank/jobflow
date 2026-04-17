import { getResumeById } from "@/actions/profile.actions";
import ResumeContainer from "@/components/profile/ResumeContainer";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";

async function ResumePage({ params }: any) {
  const { id } = params;
  
  try {
    const resume = await getResumeById(id);
    
    // Check if resume is null/undefined or if it's an error response
    if (!resume || (typeof resume === "object" && "success" in resume && !resume.success)) {
      redirect("/dashboard/profile");
    }
    
    return (
      <div className="col-span-3">
        <ResumeContainer resume={resume} />
      </div>
    );
  } catch (error) {
    // If resume not found or access denied, redirect to profile page
    redirect("/dashboard/profile");
  }
}

export default ResumePage;

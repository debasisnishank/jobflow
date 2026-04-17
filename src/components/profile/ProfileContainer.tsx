"use client";

import { Card, CardContent } from "../ui/card";
import Loading from "../Loading";
import { useProfileResumes } from "./hooks/useProfileResumes";
import { ProfileHeader } from "./ProfileHeader";
import { ProfileResumeList } from "./ProfileResumeList";
import { ProfileEmptyState } from "./ProfileEmptyState";

function ProfileContainer() {
  const {
    resumes,
    totalResumes,
    page,
    loading,
    resumeDialogOpen,
    setResumeDialogOpen,
    resumeToEdit,
    setResumeToEdit,
    loadResumes,
    reloadResumes,
    createResume,
    onEditResume,
  } = useProfileResumes();

  const handleLoadMore = () => {
    loadResumes(page + 1);
  };

  return (
    <Card className="border border-border/70 shadow-lg">
      <ProfileHeader
        resumeDialogOpen={resumeDialogOpen}
        setResumeDialogOpen={setResumeDialogOpen}
        reloadResumes={reloadResumes}
        resumeToEdit={resumeToEdit}
        setResumeToEdit={setResumeToEdit}
        onCreateResume={createResume}
      />
      <CardContent className="p-6">
        {loading && <Loading />}
        {resumes.length > 0 ? (
          <ProfileResumeList
            resumes={resumes}
            totalResumes={totalResumes}
            page={page}
            loading={loading}
            onEditResume={onEditResume}
            onReloadResumes={reloadResumes}
            onLoadMore={handleLoadMore}
          />
        ) : (
          <ProfileEmptyState onCreateResume={createResume} />
        )}
      </CardContent>
    </Card>
  );
}

export default ProfileContainer;

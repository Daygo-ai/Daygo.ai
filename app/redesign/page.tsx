import { redirect } from "next/navigation";

// The redesign shipped as the real home page. This route stays only so the
// preview links shared while it was in progress don't dead-end.
export default function RedesignPreview() {
  redirect("/");
}

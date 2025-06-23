import supabase from "../supabaseClient";

const ApplicationFormServices = {
  async getApplicationFormById(id: string) {
    const { data, error } = await supabase
      .from("application_form")
      .select("*")
      .eq("id", id)
      .single();
    if (error) return null;
    return data;
  },
  async getApplicationForms(
    page: number,
    pageSize: number,
    searchPhone?: string,
    statusFilter?: string,
    searchName?: string,
    searchDob?: string,
    searchAddress?: string,
    searchEducation?: string,
    searchRegisterLocation?: string,
    searchRegisterMajor?: string,
    searchNote?: string
  ) {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    let query = supabase
      .from("application_form")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    if (searchPhone && searchPhone.trim() !== "") {
      query = query.ilike("phone", `%${searchPhone.trim()}%`);
    }
    if (statusFilter && statusFilter !== "") {
      query = query.eq("status", statusFilter);
    }
    if (searchName && searchName.trim() !== "") {
      query = query.ilike("full_name", `%${searchName.trim()}%`);
    }
    if (searchDob && searchDob.trim() !== "") {
      query = query.eq("dob", searchDob.trim());
    }
    if (searchAddress && searchAddress.trim() !== "") {
      query = query.ilike("address", `%${searchAddress.trim()}%`);
    }
    if (searchEducation && searchEducation.trim() !== "") {
      query = query.ilike("education", `%${searchEducation.trim()}%`);
    }
    if (searchRegisterLocation && searchRegisterLocation.trim() !== "") {
      query = query.ilike(
        "register_location",
        `%${searchRegisterLocation.trim()}%`
      );
    }
    if (searchRegisterMajor && searchRegisterMajor.trim() !== "") {
      query = query.ilike("register_major", `%${searchRegisterMajor.trim()}%`);
    }
    if (searchNote && searchNote.trim() !== "") {
      query = query.ilike("note", `%${searchNote.trim()}%`);
    }

    const { data, error, count } = await query.range(from, to);
    if (error) return { data: [], count: 0 };
    return { data, count };
  },
  async updateApplicationFormStatus(
    id: number,
    status: "unread" | "read" | "processing" | "accepted" | "rejected"
  ) {
    const { data, error } = await supabase
      .from("application_form")
      .update({ status })
      .eq("id", id)
      .single();
    if (error) return null;
    return data;
  },
};

export default ApplicationFormServices;

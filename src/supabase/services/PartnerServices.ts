import supabase from "../supabaseClient";

const PartnerServices = {
  // Get partners with pagination and optional filters
  async getPartners(page = 1, pageSize = 10, name = "") {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    let query = supabase
      .from("partner")
      .select("*", { count: "exact" })
      .range(from, to)
      .order("id", { ascending: false });

    if (name) {
      query = query.ilike("name", `%${name}%`);
    }

    const { data, count, error } = await query;
    return { data, count, error };
  },

  // Update partner by id
  async updatePartner(
    partnerId: string,
    data: { name?: string; image?: string; link?: string }
  ) {
    const { error } = await supabase
      .from("partner")
      .update(data)
      .eq("id", partnerId);
    return { error };
  },

  // Delete partner by id
  async deletePartner(partnerId: string) {
    const { error } = await supabase
      .from("partner")
      .delete()
      .eq("id", partnerId);
    return { error };
  },

  // Create partner
  async createPartner(data: { name: string; image: string }) {
    const { error } = await supabase.from("partner").insert([data]);
    return { error };
  },
};

export default PartnerServices;

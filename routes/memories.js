router.get("/", async (req, res) => {
  const memories = await Memory.find().sort({ createdAt: -1 }); // ✅ sort latest first
  res.json(memories);
});

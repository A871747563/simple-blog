function cloudhandle(result) {
  const handleResult = [];
  for (item of result) {
    const temp = item["blog_tag"].split("，");
    for (itemArray of temp) {
      handleResult.push(itemArray);
    }
  }
  return handleResult;
}
module.exports = { cloudhandle };

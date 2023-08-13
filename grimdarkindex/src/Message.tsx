function Message() {
  //JSX: Javascript XML
  const name = "Grimdark Index";
  if (name) return <h1>{name}</h1>;
  return <h1>Error in Name</h1>;
}

export default Message;

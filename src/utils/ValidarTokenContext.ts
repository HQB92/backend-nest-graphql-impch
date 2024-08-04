const validateContext = (user) => {
  if (!user) {
    throw new Error('You are not authenticated!');
  }
};

export default validateContext;

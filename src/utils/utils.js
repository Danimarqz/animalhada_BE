export const errorMsg = (c, error) => c.json( { error: error.message }, 500);

export const getPaginationLimits = (page) => {
	const limit = page ? parseInt(page) * 20 : null;
	return limit ? { from: limit - 20, to: limit } : null;
  };

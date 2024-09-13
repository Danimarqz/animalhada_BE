// src/templates/basic/productAPI.js
import { createSupabaseClient } from './supabaseClient';

const productAPI = (app, env) => {
	const supabase = createSupabaseClient(env);
	app.get('/product', async (c) => {
		const { data, error } = await supabase.from('product').select('*');

		if (error) {
		return c.json({ error: error.message }, 500);
		}

		return c.json(data);
	});

	app.post('/product', async (c) => {
		const newproduct = await c.req.json();
		const { data, error } = await supabase.from('product').insert([newproduct]);

		if (error) {
		return c.json({ error: error.message }, 500);
		}

		return c.json(data);
	});

	app.put('/product/:id', async (c) => {
		const id = c.req.param('id');
		const updates = await c.req.json();
		const { data, error } = await supabase.from('product').update(updates).eq('id', id);

		if (error) {
		return c.json({ error: error.message }, 500);
		}

		return c.json(data);
	});

	app.delete('/product/:id', async (c) => {
		const id = c.req.param('id');
		const { data, error } = await supabase.from('product').delete().eq('id', id);

		if (error) {
		return c.json({ error: error.message }, 500);
		}

		return c.json(data);
	});
};

export default productAPI;

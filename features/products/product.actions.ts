'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { buildProductSlug } from '@/features/products/product.helpers';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { productSchema } from '@/lib/validations/product.validation';
import type { ProductFormState } from '@/types/product.types';

const DEFAULT_PRODUCT_STATE: ProductFormState = {
  success: false,
  message: ''
};

function getStringField(formData: FormData, field: string) {
  const value = formData.get(field);

  return typeof value === 'string' ? value : '';
}

function parseProductFormData(formData: FormData) {
  return productSchema.safeParse({
    name: getStringField(formData, 'name'),
    category_id: getStringField(formData, 'category_id'),
    default_unit_id: getStringField(formData, 'default_unit_id'),
    description: getStringField(formData, 'description') || null,
    image_url: getStringField(formData, 'image_url')
  });
}

export async function createProductAction(_state: ProductFormState = DEFAULT_PRODUCT_STATE, formData: FormData): Promise<ProductFormState> {
  const parsed = parseProductFormData(formData);

  if (!parsed.success) {
    return {
      success: false,
      message: 'Revisa los datos del producto.',
      errors: parsed.error.flatten().fieldErrors
    };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      message: 'Debes iniciar sesión para crear productos.'
    };
  }

  const slug = buildProductSlug(parsed.data.name);
  const { data, error } = await supabase
    .from('products')
    .insert({
      ...parsed.data,
      slug,
      user_id: user.id,
      is_system: false
    })
    .select('id')
    .single();

  if (error) {
    return {
      success: false,
      message: error.message.includes('duplicate') ? 'Ya existe un producto propio con ese nombre.' : 'No pudimos crear el producto. Inténtalo de nuevo.'
    };
  }

  revalidatePath('/products');
  redirect(`/products/${data.id}`);
}

export async function updateProductAction(productId: string, _state: ProductFormState = DEFAULT_PRODUCT_STATE, formData: FormData): Promise<ProductFormState> {
  const parsed = parseProductFormData(formData);

  if (!parsed.success) {
    return {
      success: false,
      message: 'Revisa los datos del producto.',
      errors: parsed.error.flatten().fieldErrors
    };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      message: 'Debes iniciar sesión para editar productos.'
    };
  }

  const slug = buildProductSlug(parsed.data.name);
  const { error } = await supabase
    .from('products')
    .update({
      ...parsed.data,
      slug
    })
    .eq('id', productId)
    .eq('user_id', user.id)
    .eq('is_system', false);

  if (error) {
    return {
      success: false,
      message: error.message.includes('duplicate') ? 'Ya existe un producto propio con ese nombre.' : 'No pudimos actualizar el producto. Inténtalo de nuevo.'
    };
  }

  revalidatePath('/products');
  revalidatePath(`/products/${productId}`);
  redirect(`/products/${productId}`);
}

export async function deleteProductAction(productId: string) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { error } = await supabase.from('products').delete().eq('id', productId).eq('user_id', user.id).eq('is_system', false);

  if (error) {
    throw new Error('No pudimos eliminar el producto.');
  }

  revalidatePath('/products');
  redirect('/products');
}

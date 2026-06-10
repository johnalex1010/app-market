'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { buildCategorySlug } from '@/features/categories/category.helpers';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { categorySchema } from '@/lib/validations/category.validation';
import type { CategoryFormState } from '@/types/category.types';

const DEFAULT_CATEGORY_STATE: CategoryFormState = {
  success: false,
  message: ''
};

function getStringField(formData: FormData, field: string) {
  const value = formData.get(field);

  return typeof value === 'string' ? value : '';
}

function parseCategoryFormData(formData: FormData) {
  return categorySchema.safeParse({
    name: getStringField(formData, 'name'),
    icon: getStringField(formData, 'icon') || null,
    color: getStringField(formData, 'color') || '#2563eb'
  });
}

export async function createCategoryAction(_state: CategoryFormState = DEFAULT_CATEGORY_STATE, formData: FormData): Promise<CategoryFormState> {
  const parsed = parseCategoryFormData(formData);

  if (!parsed.success) {
    return {
      success: false,
      message: 'Revisa los datos de la categoría.',
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
      message: 'Debes iniciar sesión para crear categorías.'
    };
  }

  const { error } = await supabase.from('categories').insert({
    ...parsed.data,
    slug: buildCategorySlug(parsed.data.name),
    user_id: user.id,
    is_system: false
  });

  if (error) {
    return {
      success: false,
      message: error.message.includes('duplicate') ? 'Ya existe una categoría propia con ese nombre.' : 'No pudimos crear la categoría. Inténtalo de nuevo.'
    };
  }

  revalidatePath('/categories');
  revalidatePath('/products');

  return {
    success: true,
    message: 'Categoría creada.'
  };
}

export async function updateCategoryAction(categoryId: string, _state: CategoryFormState = DEFAULT_CATEGORY_STATE, formData: FormData): Promise<CategoryFormState> {
  const parsed = parseCategoryFormData(formData);

  if (!parsed.success) {
    return {
      success: false,
      message: 'Revisa los datos de la categoría.',
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
      message: 'Debes iniciar sesión para editar categorías.'
    };
  }

  const { error } = await supabase
    .from('categories')
    .update({
      ...parsed.data,
      slug: buildCategorySlug(parsed.data.name)
    })
    .eq('id', categoryId)
    .eq('user_id', user.id)
    .eq('is_system', false);

  if (error) {
    return {
      success: false,
      message: error.message.includes('duplicate') ? 'Ya existe una categoría propia con ese nombre.' : 'No pudimos actualizar la categoría. Inténtalo de nuevo.'
    };
  }

  revalidatePath('/categories');
  revalidatePath('/products');
  redirect('/categories');
}

export async function deleteCategoryAction(categoryId: string) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Debes iniciar sesión para eliminar categorías.');
  }

  const { error } = await supabase.from('categories').delete().eq('id', categoryId).eq('user_id', user.id).eq('is_system', false);

  if (error) {
    throw new Error('No pudimos eliminar la categoría.');
  }

  revalidatePath('/categories');
  revalidatePath('/products');
}

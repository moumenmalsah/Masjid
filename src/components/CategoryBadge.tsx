interface CategoryBadgeProps {
  type: 'income' | 'expense';
  category: string;
}

export default function CategoryBadge({ type, category }: CategoryBadgeProps) {
  const isIncome = type === 'income';
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 font-arabic text-xs ${
        isIncome
          ? 'bg-emerald-50 text-emerald-700'
          : 'bg-red-50 text-red-500'
      }`}
    >
      {category}
    </span>
  );
}

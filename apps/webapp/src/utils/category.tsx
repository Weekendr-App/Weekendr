import { Category } from "@diplomski/gql/graphql";
import Image from "next/image";

const CATEGORY_ICON_SIZE = 24;

function getIcon(category: Category) {
  if (category.icon && category.icon.startsWith("http")) {
    return (
      <Image
        className="ml-1"
        alt={category.name}
        src={category.icon}
        width={CATEGORY_ICON_SIZE}
        height={CATEGORY_ICON_SIZE}
      />
    );
  }

  return <span className="ml-1">{category.icon}</span>;
}

export function renderCategory(category: Category) {
  return (
    <div className="flex items-center text-bold">
      {getIcon(category)}
      <span className="ml-2">{category.name}</span>
    </div>
  );
}

import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { HomePage } from "./HomePage";
import { MemoryRouter } from "react-router";
import { useHeroPaginated } from "@/heroes/hooks/useHeroPaginated";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FavoriteHeroProvider } from "@/heroes/context/FavoriteHeroContext";

vi.mock("@/heroes/hooks/useHeroPaginated");

const mockUsePaginatedHero = vi.mocked(useHeroPaginated);

mockUsePaginatedHero.mockReturnValue({
  data: [],
  isLoading: false,
  isError: false,
  isSuccess: true,
} as unknown as ReturnType<typeof useHeroPaginated>);

const queryClient = new QueryClient();

const renderHomePage = (initialEntries: string[] = ["/"]) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <FavoriteHeroProvider>
        <QueryClientProvider client={queryClient}>
          <HomePage />
        </QueryClientProvider>
      </FavoriteHeroProvider>
    </MemoryRouter>,
  );
};

describe("HomePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("should render HomePage with default values", () => {
    const { container } = renderHomePage();

    expect(container).toMatchSnapshot();
  });

  test("should call usePaginatedHero with default values", () => {
    renderHomePage();
    expect(mockUsePaginatedHero).toHaveBeenCalledWith(1, 6, "all");
  });

  test("should call usePaginatedHero with custom query params", () => {
    renderHomePage(["/?category=villains&page=2&limit=10"]);
    expect(mockUsePaginatedHero).toHaveBeenCalledWith(2, 10, "villains");
  });

  test("should called usePaginatedHero with default range and same limit on tab clicked", () => {
    renderHomePage(["/?tab=favorites&page=2&limit=10"]);

    // const [allTabs, favoriteTab,heroesTab, villainsTab] = screen.getAllByRole("tab");
    const [, , , villainsTab] = screen.getAllByRole("tab");

    fireEvent.click(villainsTab);
    expect(mockUsePaginatedHero).toHaveBeenCalledWith(1, 10, "villain");
  });
});

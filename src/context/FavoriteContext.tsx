import React, { createContext, useContext, useEffect, useState } from "react";
import { Media } from "../models/Media";

interface FavoriteContextProps {
  favorites: Media[];
  addFavorite: (item: Media) => void;
  removeFavorite: (id: number) => void;
}

const FavoriteContext = createContext<FavoriteContextProps | undefined>(
  undefined
);

export const useFavorite = () => {
  const context = useContext(FavoriteContext);
  if (!context) {
    throw new Error("FavoriteProvider로 감싸지 않은거 아닐까?");
  }
  return context;
};

export const FavoriteProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // 상태 변경 해주는 것 + 원래 있던 거 불러오기
  const [favorites, setFavorites] = useState<Media[]>(() => {
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      try {
        return JSON.parse(storedFavorites);
      } catch (e) {
        console.error("로컬 스토리지에서 찜 목록을 불러오지 못했어요.", e);
        return [];
      }
    }
    return [];
  });

  // 로컬 스토리지에 저장
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  // 아이템 추가
  const addFavorite = (media: Media) => {
    setFavorites((prev) => {
      if (prev.some((fav) => fav.id === media.id)) {
        return prev;
      }
      const updatedFavorites = [...prev, media];

      return updatedFavorites;
    });
  };

  // 아이템 삭제
  const removeFavorite = (id: number) => {
    setFavorites((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <FavoriteContext.Provider
      value={{ favorites, addFavorite, removeFavorite }}
    >
      {children}
    </FavoriteContext.Provider>
  );
};

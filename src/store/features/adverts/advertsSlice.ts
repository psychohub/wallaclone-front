import { createSlice } from "@reduxjs/toolkit";
import { SELECTED_ADVERT_SLUG } from "../../../config/environment";

type AdvertsState = {
	selectedAdvertSlug?: string
}

const selectedAdvertSlug = localStorage.getItem(SELECTED_ADVERT_SLUG);

const initialState: AdvertsState = {
  selectedAdvertSlug: selectedAdvertSlug ? JSON.parse(selectedAdvertSlug) : undefined
};

const advertsSlice = createSlice({
  name: 'adverts',
  initialState,
  reducers: {
    setSelectedAdvertSlug: (state, action) => {
      state.selectedAdvertSlug = action.payload;
      localStorage.setItem(SELECTED_ADVERT_SLUG, JSON.stringify(action.payload));
    },
		resetSelectedAdvertSlug: (state) => {
      state.selectedAdvertSlug = initialState.selectedAdvertSlug;
      localStorage.removeItem(SELECTED_ADVERT_SLUG);
    }
  }
});

export const { setSelectedAdvertSlug, resetSelectedAdvertSlug } = advertsSlice.actions;
export default advertsSlice.reducer;

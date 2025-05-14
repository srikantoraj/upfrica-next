// features/reviews/reviewsSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    reviews: [],
    summary: {
        average_rating: 0,
        review_count: 0,
        // [5★%, 4★%, 3★%, 2★%, 1★%]
        rating_percent: [0, 0, 0, 0, 0],
    },
    loading: false,
    error: null,
};

const reviewsSlice = createSlice({
    name: "reviews",
    initialState,
    reducers: {
        fetchReviewsStart(state) {
            state.loading = true;
            state.error = null;
        },
        fetchReviewsSuccess(state, action) {
            const { results, average_rating, review_count, rating_percent } = action.payload;
            state.loading = false;
            state.error = null;
            state.reviews = results;
            state.summary = { average_rating, review_count, rating_percent };
        },
        fetchReviewsFailure(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const {
    fetchReviewsStart,
    fetchReviewsSuccess,
    fetchReviewsFailure,
} = reviewsSlice.actions;

export default reviewsSlice.reducer;

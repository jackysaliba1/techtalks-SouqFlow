export default function AddProductPage() {
    return (
        <main className="min-h-screen bg-gray-100 p-6">
            <div className="mx-auto max-w-2xl rounded-xl bg-white p-8 shadow">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-red-700">Add Product</h1>
                    <p className="mt-1 text-gray-600">
                        Add a new product to your inventory.
                    </p>
                </div>

                <form className="space-y-5">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Product Name
                        </label>
                        <input
                            type="text"
                            placeholder="Example: Maybelline Lipstick"
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-black"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Description
                        </label>
                        <textarea
                            placeholder="Product description"
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-black"
                            rows={4}
                        />
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Price USD
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-black"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Price LBP
                            </label>
                            <input
                                type="number"
                                placeholder="0"
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-black"
                            />
                        </div>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Quantity
                            </label>
                            <input
                                type="number"
                                min="0"
                                placeholder="0"
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-black"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Low Stock Threshold
                            </label>
                            <input
                                type="number"
                                min="0"
                                defaultValue={5}
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-black"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            SKU
                        </label>
                        <input
                            type="text"
                            placeholder="Example: LIP-001"
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-black"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full rounded-lg bg-black px-4 py-3 font-semibold text-white hover:bg-gray-800"
                    >
                        Save Product
                    </button>
                </form>
            </div>
        </main>
    );
}
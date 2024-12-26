-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 25, 2024 at 08:02 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `devtest`
--

-- --------------------------------------------------------

--
-- Table structure for table `tbl_deliveries`
--

CREATE TABLE `tbl_deliveries` (
  `id` int(11) NOT NULL,
  `delivery_date` date NOT NULL,
  `delivery_time` time NOT NULL,
  `supplier` varchar(255) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `contact_number` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_productcategory`
--

CREATE TABLE `tbl_productcategory` (
  `category_id` int(11) NOT NULL,
  `category_name` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_productcategory`
--

INSERT INTO `tbl_productcategory` (`category_id`, `category_name`, `created_at`) VALUES
(2, 'School Supplies', '2024-11-09 16:28:34'),
(3, 'Uniforms', '2024-11-14 13:21:07'),
(4, 'Merchandise', '2024-11-14 14:24:56'),
(6, 'Hair/Other Accessories', '2024-12-06 06:34:52'),
(7, 'Miscellaneous', '2024-12-06 08:06:32'),
(8, 'waay lng ', '2024-12-25 18:59:37');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_products`
--

CREATE TABLE `tbl_products` (
  `product_id` int(11) NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `product_name` varchar(100) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `quantity` int(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_products`
--

INSERT INTO `tbl_products` (`product_id`, `category_id`, `product_name`, `price`, `quantity`, `created_at`) VALUES
(2, 2, 'Ballpen', 7.00, 72, '2024-11-09 16:28:55'),
(4, 2, 'pencil', 123.00, 100, '2024-11-10 14:34:55'),
(5, 3, 'College P.E Uniform Small', 450.00, 100, '2024-11-14 13:22:17'),
(7, 4, 'Lcc cap', 150.00, 96, '2024-11-14 14:25:11'),
(16, 3, 'SHS P.E Unform XL', 450.00, 50, '2024-12-06 05:32:29'),
(17, 6, 'Hair Clamp (large)', 25.00, 19, '2024-12-06 06:35:37'),
(18, 6, 'Hair Pins', 3.00, 194, '2024-12-06 06:36:26'),
(19, 6, 'Hairnet', 10.00, 50, '2024-12-06 06:37:17'),
(20, 2, 'Yellowpad Roll', 50.00, 17, '2024-12-06 06:38:55'),
(21, 2, 'Yellowpad paper 1', 1.00, 176, '2024-12-06 06:40:01'),
(22, 3, 'SBIT Departmental T-shirt medium', 600.00, 20, '2024-12-06 06:41:41'),
(23, 7, 'Thumbstacks Box', 20.00, 99, '2024-12-06 08:07:20'),
(24, 8, '213da', 123.00, 11, '2024-12-25 18:59:55');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_stock_requests`
--

CREATE TABLE `tbl_stock_requests` (
  `request_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `status` varchar(20) NOT NULL,
  `request_date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_stock_requests`
--

INSERT INTO `tbl_stock_requests` (`request_id`, `product_id`, `quantity`, `status`, `request_date`) VALUES
(1, 4, 20, 'pending', '2024-12-26 00:37:04'),
(2, 4, 100, 'pending', '2024-12-26 01:13:05');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_transactions`
--

CREATE TABLE `tbl_transactions` (
  `transaction_id` varchar(50) NOT NULL,
  `created_at` datetime NOT NULL,
  `total_amount` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_transactions`
--

INSERT INTO `tbl_transactions` (`transaction_id`, `created_at`, `total_amount`) VALUES
('T1732690389595', '2024-12-01 06:53:09', 1107.00),
('T1733159959666', '2024-12-02 17:19:19', 307.00),
('T1733170187295', '2024-12-02 20:09:47', 280.00),
('T1733326545835', '2024-12-04 15:35:45', 84.00),
('T1733414212357', '2024-12-05 15:56:52', 2337.00),
('T1733460819827', '2024-12-06 04:53:39', 140.00),
('T1733463022596', '2024-12-06 05:30:22', 369.00),
('T1733468714673', '2024-12-06 07:05:14', 23.00),
('T1733472521493', '2024-12-06 08:08:41', 50.00),
('T1733473081132', '2024-12-06 08:18:01', 38.00),
('T1735144733625', '2024-12-25 16:38:53', 42.00),
('T1735145873129', '2024-12-25 16:57:53', 600.00),
('T1735146745411', '2024-12-25 17:12:25', 123.00);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_transaction_details`
--

CREATE TABLE `tbl_transaction_details` (
  `id` int(11) NOT NULL,
  `transaction_id` varchar(50) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_transaction_details`
--

INSERT INTO `tbl_transaction_details` (`id`, `transaction_id`, `product_id`, `quantity`, `price`) VALUES
(12, 'T1732690389595', 4, 9, NULL),
(13, 'T1733159959666', 7, 2, NULL),
(14, 'T1733159959666', 2, 1, NULL),
(15, 'T1733170187295', 7, 1, NULL),
(16, 'T1733170187295', 2, 1, NULL),
(17, 'T1733170187295', 4, 1, NULL),
(18, 'T1733326545835', 2, 12, NULL),
(19, 'T1733414212357', 4, 19, NULL),
(20, 'T1733460819827', 2, 20, NULL),
(21, 'T1733463022596', 4, 3, NULL),
(22, 'T1733468714673', 18, 5, NULL),
(23, 'T1733468714673', 2, 1, NULL),
(24, 'T1733468714673', 21, 1, NULL),
(25, 'T1733472521493', 20, 1, NULL),
(26, 'T1733473081132', 2, 1, NULL),
(27, 'T1733473081132', 21, 3, NULL),
(28, 'T1733473081132', 18, 1, NULL),
(29, 'T1733473081132', 17, 1, NULL),
(30, 'T1735144733625', 2, 6, NULL),
(31, 'T1735145873129', 20, 12, NULL),
(32, 'T1735146745411', 4, 1, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `tb_logins`
--

CREATE TABLE `tb_logins` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tb_logins`
--

INSERT INTO `tb_logins` (`id`, `email`, `password`) VALUES
(1, 'admin@gmail.com', '$2b$10$JDzAYTJyVEE3VSbEYS.ItuYYKn/Vye53RcPALv5l7YBQuExwkXFcq'),
(3, 'user@gmail.com', '$2b$10$Sc6C8DpjP0Z0mLlO/IUx3OwqlVdW6T.mvMJuZDGeZhBdJtciiwL0O');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tbl_deliveries`
--
ALTER TABLE `tbl_deliveries`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `tbl_productcategory`
--
ALTER TABLE `tbl_productcategory`
  ADD PRIMARY KEY (`category_id`);

--
-- Indexes for table `tbl_products`
--
ALTER TABLE `tbl_products`
  ADD PRIMARY KEY (`product_id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `tbl_stock_requests`
--
ALTER TABLE `tbl_stock_requests`
  ADD PRIMARY KEY (`request_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `tbl_transactions`
--
ALTER TABLE `tbl_transactions`
  ADD PRIMARY KEY (`transaction_id`);

--
-- Indexes for table `tbl_transaction_details`
--
ALTER TABLE `tbl_transaction_details`
  ADD PRIMARY KEY (`id`),
  ADD KEY `transaction_id` (`transaction_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `tb_logins`
--
ALTER TABLE `tb_logins`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tbl_deliveries`
--
ALTER TABLE `tbl_deliveries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_productcategory`
--
ALTER TABLE `tbl_productcategory`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `tbl_products`
--
ALTER TABLE `tbl_products`
  MODIFY `product_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `tbl_stock_requests`
--
ALTER TABLE `tbl_stock_requests`
  MODIFY `request_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `tbl_transaction_details`
--
ALTER TABLE `tbl_transaction_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `tb_logins`
--
ALTER TABLE `tb_logins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `tbl_deliveries`
--
ALTER TABLE `tbl_deliveries`
  ADD CONSTRAINT `tbl_deliveries_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `tbl_products` (`product_id`) ON DELETE CASCADE;

--
-- Constraints for table `tbl_products`
--
ALTER TABLE `tbl_products`
  ADD CONSTRAINT `tbl_products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `tbl_productcategory` (`category_id`);

--
-- Constraints for table `tbl_stock_requests`
--
ALTER TABLE `tbl_stock_requests`
  ADD CONSTRAINT `tbl_stock_requests_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `tbl_products` (`product_id`);

--
-- Constraints for table `tbl_transaction_details`
--
ALTER TABLE `tbl_transaction_details`
  ADD CONSTRAINT `tbl_transaction_details_ibfk_1` FOREIGN KEY (`transaction_id`) REFERENCES `tbl_transactions` (`transaction_id`),
  ADD CONSTRAINT `tbl_transaction_details_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `tbl_products` (`product_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 01, 2025 at 09:08 AM
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
  `total_amount` decimal(10,2) NOT NULL,
  `contact_number` varchar(15) NOT NULL,
  `cost_price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `selling_price` decimal(10,2) NOT NULL DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_deliveries`
--

INSERT INTO `tbl_deliveries` (`id`, `delivery_date`, `delivery_time`, `supplier`, `product_id`, `quantity`, `total_amount`, `contact_number`, `cost_price`, `selling_price`) VALUES
(10, '2025-01-09', '18:59:00', '213', 22, 100, 1000.00, '123121', 10.00, 10.00),
(11, '2025-01-04', '17:01:00', 'national bookstore', 2, 100, 400.00, '09231321', 4.00, 7.00);

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
(7, 'Miscellaneous', '2024-12-06 08:06:32');

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
(2, 2, 'Ballpen', 7.00, 99, '2024-11-09 16:28:55'),
(4, 2, 'pencil', 123.00, 99, '2024-11-10 14:34:55'),
(5, 3, 'College P.E Uniform Small', 450.00, 100, '2024-11-14 13:22:17'),
(7, 4, 'Lcc cap', 150.00, 95, '2024-11-14 14:25:11'),
(16, 3, 'SHS P.E Unform XL', 500.00, 48, '2024-12-06 05:32:29'),
(17, 6, 'Hair Clamp (large)', 25.00, 13, '2024-12-06 06:35:37'),
(18, 6, 'Hair Pins', 3.00, 192, '2024-12-06 06:36:26'),
(19, 6, 'Hairnet', 10.00, 18, '2024-12-06 06:37:17'),
(20, 2, 'Yellowpad Roll', 50.00, 16, '2024-12-06 06:38:55'),
(21, 2, 'Yellowpad paper 1', 1.00, 175, '2024-12-06 06:40:01'),
(22, 3, 'SBIT Departmental T-shirt medium', 600.00, 19, '2024-12-06 06:41:41'),
(23, 7, 'Thumbstacks Box', 20.00, 89, '2024-12-06 08:07:20'),
(25, 2, 'Panda ballben', 10.00, 97, '2024-12-27 06:12:48');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_request_password`
--

CREATE TABLE `tbl_request_password` (
  `request_id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `request_date` datetime NOT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_request_password`
--

INSERT INTO `tbl_request_password` (`request_id`, `email`, `request_date`, `status`, `created_at`) VALUES
(1, 'user@gmail.com', '2024-12-27 13:33:29', 'pending', '2024-12-27 05:33:29');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_stock_requests`
--

CREATE TABLE `tbl_stock_requests` (
  `request_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `status` varchar(20) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_stock_requests`
--

INSERT INTO `tbl_stock_requests` (`request_id`, `product_id`, `quantity`, `status`, `created_at`) VALUES
(1, 4, 20, 'completed', '2024-12-27 10:22:41'),
(2, 4, 100, 'completed', '2024-12-27 10:22:41'),
(3, 22, 20, 'completed', '2024-12-27 10:22:41'),
(4, 20, 9, 'completed', '2024-12-27 10:22:41'),
(5, 20, 2, 'completed', '2024-12-27 10:22:50'),
(6, 17, 10, 'completed', '2024-12-27 10:23:58'),
(7, 19, 123, 'completed', '2024-12-27 12:58:10'),
(8, 25, 100, 'completed', '2024-12-27 14:14:13');

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
('T1735711180899', '2025-01-01 05:59:40', 38.00),
('T1735711217902', '2025-01-01 06:00:17', 146.00),
('T1735711277065', '2025-01-01 06:01:17', 15.00),
('T1735711333510', '2025-01-01 06:02:13', 10.00),
('T1735718757120', '2025-01-01 08:05:57', 450.00),
('T1735718820975', '2025-01-01 08:07:00', 500.00);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_transaction_details`
--

CREATE TABLE `tbl_transaction_details` (
  `id` int(11) NOT NULL,
  `transaction_id` varchar(50) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `price_at_time` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_transaction_details`
--

INSERT INTO `tbl_transaction_details` (`id`, `transaction_id`, `product_id`, `quantity`, `price`, `price_at_time`) VALUES
(1, 'T1735711180899', 17, 1, NULL, 25.00),
(2, 'T1735711180899', 18, 1, NULL, 3.00),
(3, 'T1735711180899', 19, 1, NULL, 10.00),
(4, 'T1735711217902', 2, 1, NULL, 7.00),
(5, 'T1735711217902', 25, 1, NULL, 15.00),
(6, 'T1735711217902', 4, 1, NULL, 123.00),
(7, 'T1735711217902', 21, 1, NULL, 1.00),
(8, 'T1735711277065', 25, 1, NULL, 15.00),
(9, 'T1735711333510', 25, 1, NULL, 10.00),
(10, 'T1735718757120', 16, 1, NULL, 450.00),
(11, 'T1735718820975', 16, 1, NULL, 500.00);

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
  ADD KEY `product_id` (`product_id`),
  ADD KEY `idx_delivery_date` (`delivery_date`),
  ADD KEY `idx_supplier` (`supplier`);

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
-- Indexes for table `tbl_request_password`
--
ALTER TABLE `tbl_request_password`
  ADD PRIMARY KEY (`request_id`),
  ADD KEY `idx_email` (`email`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `tbl_productcategory`
--
ALTER TABLE `tbl_productcategory`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `tbl_products`
--
ALTER TABLE `tbl_products`
  MODIFY `product_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `tbl_request_password`
--
ALTER TABLE `tbl_request_password`
  MODIFY `request_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `tbl_stock_requests`
--
ALTER TABLE `tbl_stock_requests`
  MODIFY `request_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `tbl_transaction_details`
--
ALTER TABLE `tbl_transaction_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

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

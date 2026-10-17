package techtalks.com.souqflow.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import techtalks.com.souqflow.entity.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    @Query("select u.merchant.id from User u where u.email = :email")
    Optional<Long> findMerchantIdByEmail(@Param("email") String email);
}
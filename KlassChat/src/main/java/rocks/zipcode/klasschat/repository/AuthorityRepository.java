package rocks.zipcode.klasschat.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import rocks.zipcode.klasschat.domain.Authority;

/**
 * Spring Data JPA repository for the {@link Authority} entity.
 */
public interface AuthorityRepository extends JpaRepository<Authority, String> {}

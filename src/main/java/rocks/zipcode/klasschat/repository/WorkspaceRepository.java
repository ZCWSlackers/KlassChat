package rocks.zipcode.klasschat.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import rocks.zipcode.klasschat.domain.Message;
import rocks.zipcode.klasschat.domain.Workspace;

/**
 * Spring Data JPA repository for the Workspace entity.
 *
 * When extending this class, extend WorkspaceRepositoryWithBagRelationships too.
 * For more information refer to https://github.com/jhipster/generator-jhipster/issues/17990.
 */
@Repository
public interface WorkspaceRepository extends WorkspaceRepositoryWithBagRelationships, JpaRepository<Workspace, Long> {
    default Optional<Workspace> findOneWithEagerRelationships(Long id) {
        return this.fetchBagRelationships(this.findById(id));
    }

    default List<Workspace> findAllWithEagerRelationships() {
        return this.fetchBagRelationships(this.findAll());
    }

    default Page<Workspace> findAllWithEagerRelationships(Pageable pageable) {
        return this.fetchBagRelationships(this.findAll(pageable));
    }
}
